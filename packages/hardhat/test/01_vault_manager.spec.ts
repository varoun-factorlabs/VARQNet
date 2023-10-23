import { ethers } from "hardhat";

describe("Vault", function () {
  before(async function () {
    this.signers = await (ethers as any).getSigners();
  });

  describe("Initialization", function () {
    this.beforeEach(async function () {
      const managerFactory = await ethers.getContractFactory("VaultManager");
      this.vault = await managerFactory.deploy();
    });

    it("deploys two tokenized vaults");

    it("collateralized token vault share ratio is 1:1 by default");

    it("market token vault share ratio is 7:1 by default");
  });

  describe("Configuration", function () {});
});
