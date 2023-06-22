// SPDX-License-Identifier: MIT
// pragma solidity ^0.4.22;
pragma solidity >=0.6.0 <0.9.0;

/*********************** Interface Definition *******************/

/**
 * @dev Interface of the Sytemap asset registry nft attribute.
 */
interface ICampaignRegistry {
    enum CampaignStatus { Ongoing, Successful, Expired }
    enum Category {Entrepreneur, Investor, Vendor}

    struct User {
        string email;
        string password;
        Category category;
        address walletAddress;
        bool verified;
    }
    struct Contributions {
  uint256 value;
  uint256 date;
}

    struct Campaign {
        uint256 campaignId;
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 requestAmount;
        uint256 deadline;
        uint256 completeAt;
        uint256 startAt;
        string imageUri;
        string campaignTitle;
        string campaignDescription;
        address entrepreneur;
        address vendor;
        address[] investors; 
        CampaignStatus status;
        bool requestCreated;
    }

    /*********************** Events *******************/

    /**
     * @notice Emitted when a new property NFT is minted.
     * @param campaignId The plotno of the collection owner at this time this property NFT was minted.
     * @param entrepreneur The tokenURL of the newly minted property NFT, indexed to enable watching for mint events by the tokenurl.
     * @param targetAmount The estateName of the newly minted property NFT, 
     * @param deadline The actual price of the plot of the newly minted property NFT.
     */
     event CampaignCreated(uint campaignId, address entrepreneur, uint targetAmount, uint deadline);
      /**
     * @notice Emitted when a new property NFT is minted.
     * @param campaignId The plotno of the collection owner at this time this property NFT was minted.
     * @param investor The tokenURL of the newly minted property NFT, indexed to enable watching for mint events by the tokenurl.
     * @param amount The estateName of the newly minted property NFT, 
     */
    event ContributionMade(uint campaignId, address investor, uint amount);
     /**
     * @notice Emitted when a new property NFT is minted.
     * @param campaignId The plotno of the collection owner at this time this property NFT was minted.
     * @param requestAmount The tokenURL of the newly minted property NFT, indexed to enable watching for mint events by the tokenurl.
     */
    event RequestCreated(uint campaignId, uint requestAmount);
     /**
     * @notice Emitted when a new property NFT is minted.
     * @param campaignId The plotno of the collection owner at this time this property NFT was minted.
     * @param vendor The tokenURL of the newly minted property NFT, indexed to enable watching for mint events by the tokenurl.
     * @param amount The tokenURL of the newly minted property NFT, indexed to enable watching for mint events by the tokenurl.
     */
    event FundsReleased(uint campaignId, address vendor, uint amount);

     /**
     * @notice Emitted when a new property NFT is minted.
     * @param campaignId The plotno of the collection owner at this time this property NFT was minted.
     * @param investor The tokenURL of the newly minted property NFT, indexed to enable watching for mint events by the tokenurl.
     */
    event RequestApproved(uint campaignId, address investor);


    /*********************** Interface Methods  *******************/

}
