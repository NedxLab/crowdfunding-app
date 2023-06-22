// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./interfaces/ICampaignRegistry.sol";

contract CampaignRegistry is ICampaignRegistry, Initializable, OwnableUpgradeable, UUPSUpgradeable {
    /*************** State attributes ***************/
    /**
     * @notice This is to track the number of campaign created.
     */
    uint256 private campaignIdCounter;

    /*********************** Mapping *******************/

    // This is to keep track of the number of campaign created by contributors
    mapping(uint256 => uint256) private campaignContributorCount;

    /**
     * @dev mapping from User info to wallet address
     * @notice is one to many mapping, meaning that a single property could have more that one asset
     */
    mapping(address => User) public users;

    /**
     * @dev mapping from campaign infor to campaign number
     * @notice is one to many mapping, meaning that a single property could have more that one asset
     */
    mapping(uint256 => Campaign) public campaigns;

    // This mapping campaign id to map of address contributions
    mapping(uint256 => mapping(address => uint256)) private contributions;
    mapping(uint256 => mapping(address => bool)) private investorApprovals;

    /*********************** Modifiers *******************/

    modifier onlyVerifiedUser() {
        require(users[msg.sender].verified, "Only verified users can participate");
        _;
    }

    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId < campaignIdCounter, "Campaign does not exist");
        _;
    }

    modifier onlyCategory(Category _category) {
        require(
            users[msg.sender].category == _category,
            "Only users of the specified category can perform this action"
        );
        _;
    }

    modifier validateExpiry(uint256 campaignId, CampaignStatus _status) {
        require(campaigns[campaignId].status == _status, "Invalid state");
        require(block.timestamp < campaigns[campaignId].deadline, "Deadline has passed !");
        _;
    }

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    /*********************** External methods *******************/
    function registerUser(string memory _email, string memory _password, Category _category) external {
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(bytes(_password).length > 0, "Password cannot be empty");
        require(msg.sender != address(0), "Invalid wallet address");
        require(!users[msg.sender].verified, "User is already registered");

        users[msg.sender] = User(_email, _password, _category, msg.sender, true);
    }

    function loginUser(string memory _email, string memory _password) external view returns (bool) {
        User storage user = users[msg.sender];
        if (
            users[msg.sender].verified &&
            keccak256(bytes(user.email)) == keccak256(bytes(_email)) &&
            keccak256(bytes(user.password)) == keccak256(bytes(_password))
        ) {
            return true;
        }
        return false;
    }

    function createCampaign(
        uint256 _targetAmount,
        uint256 _deadline,
        string memory _imageUri,
        string memory _campaignTitle,
        string memory _campaignDescription
    ) external onlyVerifiedUser onlyCategory(Category.Entrepreneur) {
        require(_targetAmount > 0, "Target amount must be greater than zero");

        uint256 deadline = block.timestamp + _deadline;
        Campaign storage campaign = campaigns[campaignIdCounter];
        require(campaign.deadline < block.timestamp, "The campaign must be a date in the future");

        campaign.campaignId = getCampaignCount();
        campaign.entrepreneur = msg.sender;
        campaign.targetAmount = _targetAmount;
        campaign.imageUri = _imageUri;
        campaign.campaignTitle = _campaignTitle;
        campaign.campaignDescription = _campaignDescription;
        campaign.deadline = deadline;
        campaign.startAt = block.timestamp;
        campaign.status = CampaignStatus.Ongoing;
        campaignIdCounter++;

        emit CampaignCreated(campaignIdCounter - 1, msg.sender, _targetAmount, deadline);
    }

    function donateToCampaign(
        uint256 _campaignId
    )
        external
        payable
        onlyVerifiedUser
        onlyCategory(Category.Investor)
        validateExpiry(_campaignId, CampaignStatus.Ongoing)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == CampaignStatus.Ongoing, "Campaign is not ongoing");
        require(block.timestamp < campaign.deadline, "Campaign period has ended");
        require(msg.value > 0, "Donation amount must be greater than zero");
        require(block.timestamp >= campaign.startAt, "Campaign has not Started yet");
        uint256 donationAmount = msg.value;

        contributions[_campaignId][msg.sender] += donationAmount;
        campaign.raisedAmount += donationAmount;
        campaignContributorCount[_campaignId]++;
        if (contributions[_campaignId][msg.sender] == donationAmount) {
            campaign.investors.push(msg.sender);
        }
        emit ContributionMade(_campaignId, msg.sender, msg.value);
        _checkFundingCompleteOrExpire(_campaignId);
    }

    function getCampaignCount() internal view returns (uint256) {
        return campaignIdCounter;
    }

    function getInvestorDonations(uint256 _campaignId) public view returns (address[] memory, uint256[] memory) {
        Campaign storage campaign = campaigns[_campaignId];

        uint256 investorCount = campaign.investors.length;
        address[] memory investors = new address[](investorCount);
        uint256[] memory donations = new uint256[](investorCount);

        for (uint256 i = 0; i < investorCount; i++) {
            address investor = campaign.investors[i];
            investors[i] = investor;
            donations[i] = contributions[_campaignId][investor];
        }

        return (investors, donations);
    }
function getAllDonators(uint256 _campaignId) public view returns (address[] memory) {
        Campaign storage campaign = campaigns[_campaignId];

        return campaign.investors;
    }

    function getAllDonations(uint256 _campaignId) public view returns (uint256[] memory) {
        Campaign storage campaign = campaigns[_campaignId];

        uint256 investorCount = campaign.investors.length;
        uint256[] memory donations = new uint256[](investorCount);

        for (uint256 i = 0; i < investorCount; i++) {
            address investor = campaign.investors[i];
            donations[i] = contributions[_campaignId][investor];
        }

        return donations;
    }

    function getCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignIdCounter);

        for (uint256 i = 0; i < campaignIdCounter; ) {
            allCampaigns[i] = campaigns[i];
            unchecked {
                ++i;
            }
        }

        return allCampaigns;
    }

    function getTotalCampaignsByInvestor(address _investor) external view returns (uint256) {
        uint256 totalCampaigns = 0;
        for (uint256 i = 0; i < campaignIdCounter; i++) {
            if (contributions[i][_investor] > 0) {
                totalCampaigns++;
            }
        }

        return totalCampaigns;
    }

    function createFundReleaseRequest(
        uint256 _campaignId,
        uint256 _requestAmount
    ) external onlyVerifiedUser onlyCategory(Category.Entrepreneur) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == CampaignStatus.Ongoing, "Campaign is not ongoing");
        require(campaign.entrepreneur == msg.sender, "Only the entrepreneur can create a request");
        require(!_isRequestCreated(campaign), "A request has already been created for this campaign");
        require(
            _requestAmount <= campaign.raisedAmount,
            "Request amount must be less than or equal to the raised amount"
        );

        campaign.requestAmount = _requestAmount;
        campaign.requestCreated = true;

        emit RequestCreated(_campaignId, _requestAmount);
    }

    function approveFundReleaseRequest(uint256 _campaignId) external onlyVerifiedUser onlyCategory(Category.Investor) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == CampaignStatus.Ongoing, "Campaign is not ongoing");
        require(contributions[_campaignId][msg.sender] > 0, "Only investors can approve a request");
        require(_isRequestCreated(campaign), "No request exists for this campaign");
        require(!investorApprovals[_campaignId][msg.sender], "Investor has already approved the request");

        investorApprovals[_campaignId][msg.sender] = true;
        emit RequestApproved(_campaignId, msg.sender);

        if (_isRequestApproved(campaign)) {
            _releaseFundsToVendors(_campaignId);
        }
    }

    /*********************** Internal methods *******************/

    function _checkFundingCompleteOrExpire(uint256 _campaignId) internal {
        if (campaigns[_campaignId].raisedAmount >= campaigns[_campaignId].targetAmount) {
            campaigns[_campaignId].status = CampaignStatus.Successful;
        } else if (block.timestamp > campaigns[_campaignId].deadline) {
            campaigns[_campaignId].status = CampaignStatus.Expired;
        }
        campaigns[_campaignId].completeAt = block.timestamp;
    }

    function _isRequestCreated(Campaign storage _campaign) private view returns (bool) {
        return _campaign.requestCreated;
    }

    function _isRequestApproved(Campaign storage _campaign) private view returns (bool) {
        uint256 approvalsRequired = _campaign.raisedAmount / 2;
        uint256 approvalCount = 0;

        for (uint256 i = 0; i < _campaign.investors.length; i++) {
            if (investorApprovals[i][_campaign.investors[i]]) {
                approvalCount++;
            }
        }

        return approvalCount >= approvalsRequired;
    }

    function _releaseFundsToVendors(uint256 _campaignId) private {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == CampaignStatus.Ongoing, "Campaign is not ongoing");
        require(_isRequestApproved(campaign), "Request has not been approved by the required number of investors");

        for (uint256 i = 0; i < campaign.investors.length; i++) {
            address vendor = campaigns[i].vendor;
            uint256 amount = campaigns[i].raisedAmount;
            payable(vendor).transfer(amount);

            emit FundsReleased(_campaignId, vendor, amount);
        }

        campaign.status = CampaignStatus.Successful;
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override {}
}
