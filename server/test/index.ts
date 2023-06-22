/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
// Import the necessary libraries and contracts
import { ethers, upgrades } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { expect } from "chai";

describe("CrowdfundingRegistry", function () {
  let campaignRegistry: Contract;
  let entrepreneur: Signer | any;
  let investor1: Signer | any;
  let investor2: Signer;
  let vendor: Signer;
  enum Category {
    Entrepreneur,
    Investor,
    Vendor,
  }
  const now = new Date().getTime();
  const fiveDaysFromNow = now + 1000 * 60 * 60 * 24 * 5;

  const dateFiveDaysFromNow = new Date(fiveDaysFromNow);

  // Deploy the contract and set up the necessary accounts
  before(async function () {
    const CampaignRegistry: ContractFactory = await ethers.getContractFactory("CampaignRegistry");
    [entrepreneur, investor1, investor2, vendor] = await ethers.getSigners();
    campaignRegistry = await upgrades.deployProxy(CampaignRegistry, {
      initializer: "initialize",
      kind: "uups",
    });
    await campaignRegistry.deployed();
  });

  describe("User Registration", function () {
    it("Should allow a user to register", async function () {
      // Register a user with email, password, and wallet address
      const email = "user@example.com";
      const password = "password";
      const category = Category.Entrepreneur;

      const walletAddress = entrepreneur.address;
      console.log({ category });
      await campaignRegistry.registerUser(email, password, category);
      const user = await campaignRegistry.users(walletAddress);
      console.log({ user: user.category });
      expect(user.email).to.equal("user@example.com");
      expect(user.category).to.equal(0);
      expect(user.password).to.equal("password");
    });

    it("Should not allow a user to register with an existing email", async function () {
      // Try to register a user with an existing email
      const email = "user@example.com";
      const password = "password";
      const walletAddress = entrepreneur.address;

      // The registration should fail and throw an error
      await expect(campaignRegistry.registerUser(email, password, walletAddress)).to.be.reverted;
    });

    it("Should not allow a user to register with an invalid wallet address", async function () {
      // Try to register a user with an invalid wallet address
      const email = "user2@example.com";
      const password = "password";
      const walletAddress = ethers.constants.AddressZero;

      // The registration should fail and throw an error
      await expect(campaignRegistry.registerUser(email, password, walletAddress)).to.be.reverted;
    });
  });

  describe("User Login", function () {
    it("Should return true for a valid user login", async function () {
      // Perform a valid login with email and password
      const email = "user@example.com";
      const password = "password";

      const isLoggedIn = await campaignRegistry.loginUser(email, password);
      expect(isLoggedIn).to.be.true;
    });

    it("Should return false for an invalid user login", async function () {
      // Perform an invalid login with incorrect email or password
      const email = "user@example.com";
      const incorrectPassword = "incorrect";

      const isLoggedIn = await campaignRegistry.loginUser(email, incorrectPassword);

      expect(isLoggedIn).to.be.false;
    });
  });

  describe("Campaign Creation and Fund Release", function () {
    // beforeEach(async function () {
    //   // Register and login as the entrepreneur
    //   const email = "entrepreneur@example.com";
    //   const password = "password";
    //   const walletAddress = investor1.address;
    //   console.log({ walletAddress });
    //   await campaignRegistry.registerUser(email, password, Category.Entrepreneur);
    //   await campaignRegistry.loginUser(email, password);
    // });

    it("should allow entrepreneur to create a campaign and release fund", async () => {
      const _targetAmount = 1000;
      const _deadline = new Date().getTime();
      const _image = "//https:url.com";
      const _campaignTitle = "Covid Support";
      const _campaignDescription = "for covid 5";

      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(_targetAmount, _deadline, _image, _campaignTitle, _campaignDescription);

      const campaign = await campaignRegistry.campaigns(0);
      console.log({ campaign: campaign });
      expect(campaign.campaignTitle.toString()).to.equal(_campaignTitle);
      expect(campaign.campaignDescription.toString()).to.equal(_campaignDescription); // Campaign status: Ongoing

      // await campaignRegistry.connect(entrepreneur).releaseFund(0);
      const updatedCampaign = await campaignRegistry.campaigns(0);

      expect(updatedCampaign.status).to.equal(0); // Campaign status: Fund Released
    });

    it("should get all created campaigns", async () => {
      const _targetAmount = 1000;
      const _deadline = 12;
      const _image = "//https:url.com";
      const _campaignTitle = "Covid Support";
      const _campaignDescription = "for covid";

      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(_targetAmount, _deadline, _image, _campaignTitle, _campaignDescription);
      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(_targetAmount, _deadline, _image, _campaignTitle, _campaignDescription);

      const campaignTotal = await campaignRegistry.getCampaigns();
      console.log({ campaignTotal });
      const campaignCount = await campaignRegistry.getCampaignCount();
      console.log({ campaignCount });

      console.log({ campaignTotal, campaignCount: campaignCount.toNumber() });
      expect(campaignCount.toNumber()).to.equal(3);
    });

    it("should get all investors and their donations for a campaign", async () => {
      const _targetAmount = 1000;
      const _deadline = 12;
      const _image = "//https:url.com";
      const _campaignTitle = "Covid Support";
      const _campaignDescription = "for covid";

      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(_targetAmount, _deadline, _image, _campaignTitle, _campaignDescription);
      await campaignRegistry.connect(investor1).donateToCampaign(0, { value: 500 });
      await campaignRegistry.connect(investor2).donateToCampaign(0, { value: 300 });

      const [donors, amount] = await campaignRegistry.getDonations(0);
      console.log({ donors, amount });
      expect(donors.length).to.equal(2);
      expect(donors[0]).to.equal(await investor1.getAddress());
      expect(donors[1]).to.equal(await investor2.getAddress());
      expect(amount[0]).to.equal(500);
      expect(amount[1]).to.equal(300);
    });

    it("should get all donators", async () => {
      const _targetAmount = 1000;
      const _deadline = 12;
      const _image = "//https:url.com";
      const _campaignTitle = "Covid Support";
      const _campaignDescription = "for covid";

      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(_targetAmount, _deadline, _image, _campaignTitle, _campaignDescription);
      await campaignRegistry.connect(investor1).donateToCampaign(0, { value: 500 });
      await campaignRegistry.connect(investor2).donateToCampaign(0, { value: 300 });

      const donators = await campaignRegistry.getAllDonators();

      expect(donators.length).to.equal(2);
      expect(donators[0]).to.equal(await investor1.getAddress());
      expect(donators[1]).to.equal(await investor2.getAddress());
    });

    it("should get all donations", async () => {
      const _targetAmount = 1000;
      const _deadline = 12;
      const _image = "//https:url.com";
      const _campaignTitle = "Covid Support";
      const _campaignDescription = "for covid";

      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(_targetAmount, _deadline, _image, _campaignTitle, _campaignDescription);
      await campaignRegistry.connect(investor1).donateToCampaign(0, { value: 500 });
      await campaignRegistry.connect(investor2).donateToCampaign(0, { value: 300 });

      const donations = await campaignRegistry.getAllDonations();

      expect(donations.length).to.equal(2);
      expect(donations[0]).to.equal(500);
      expect(donations[1]).to.equal(300);
    });

    it("should get the total number of campaigns created by an investor", async () => {
      const _targetAmount = 1000;
      const _deadline = 12;
      const _image = "//https:url.com";
      const _campaignTitle = "Covid Support";
      const _campaignDescription = "for covid";

      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(_targetAmount, _deadline, _image, _campaignTitle, _campaignDescription);
      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(_targetAmount, _deadline, _image, _campaignTitle, _campaignDescription);
      await campaignRegistry.connect(investor1).donateToCampaign(0, { value: 500 });
      await campaignRegistry.connect(investor1).donateToCampaign(1, { value: 1000 });

      const campaignCount = await campaignRegistry.getCampaignCountByInvestor(await investor1.getAddress());

      expect(campaignCount).to.equal(2);
    });

    it("should allow investors to donate to a campaign", async () => {
      const _targetAmount = 1000;
      const _deadline = 12;
      const _image = "//https:url.com";
      const _campaignTitle = "Covid Support";
      const _campaignDescription = "for covid";

      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(_targetAmount, _deadline, _image, _campaignTitle, _campaignDescription);
      await campaignRegistry.connect(investor1).donateToCampaign(0, { value: 500 });

      const campaign = await campaignRegistry.campaigns(0);

      expect(campaign.totalDonations).to.equal(500);
    });

    it("should allow entrepreneur to create a request for fund release", async () => {
      const _targetAmount = 1000;
      const _deadline = 12;
      const _image = "//https:url.com";
      const _campaignTitle = "Covid Support";
      const _campaignDescription = "for covid";

      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(_targetAmount, _deadline, _image, _campaignTitle, _campaignDescription);
      await campaignRegistry.connect(entrepreneur).releaseFund(0);
      await campaignRegistry.connect(entrepreneur).createFundReleaseRequest(0, 500);

      const request = await campaignRegistry.requests(0);

      expect(request.vendor).to.equal(await vendor.getAddress());
      expect(request.amount).to.equal(500);
      expect(request.approvalCount).to.equal(0);
      expect(request.complete).to.equal(false);
    });

    it("should release funds to vendors when the campaign period is over and 50% of investors approve the request", async () => {
      const _targetAmount = 1000;
      const _deadline = 12;
      const _image = "//https:url.com";
      const _campaignTitle = "Covid Support";
      const _campaignDescription = "for covid";

      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(_targetAmount, _deadline, _image, _campaignTitle, _campaignDescription);
      await campaignRegistry.connect(investor1).donateToCampaign(0, { value: 500 });
      await campaignRegistry.connect(investor2).donateToCampaign(0, { value: 500 });
      await campaignRegistry.connect(entrepreneur).releaseFund(0);
      await campaignRegistry.connect(entrepreneur).createRequest(0, await vendor.getAddress(), 500);

      await campaignRegistry.connect(investor1).approveFundReleaseRequest(0);
      await campaignRegistry.connect(investor2).approveFundReleaseRequest(0);

      const initialBalance = await ethers.provider.getBalance(await vendor.getAddress());

      await campaignRegistry.connect(entrepreneur).finalizeRequest(0);

      const finalBalance = await ethers.provider.getBalance(await vendor.getAddress());

      expect(finalBalance.sub(initialBalance)).to.equal(500);
    });
  });
});
