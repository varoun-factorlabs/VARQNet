import { ethers } from "hardhat";

describe("Vault", function () {
  before(async function () {
    this.signers = await (ethers as any).getSigners();
  });

  describe("Initialization", function () {
    this.beforeEach(async function () {
      const vaultFactory = await ethers.getContractFactory("Vault");
      this.vault = await vaultFactory.deploy();
    });

    it("should start with zero collateral balance");

    it("should start with zero disbursed tokenized collateral");
  });

  describe("Configuration", function () {
    it("share conversion is 1:1 by default");

    it("eoa cannot change the share conversion");
  });

  describe("Depositing", function () {
    it("should allow any user to deposit collateral");

    it("should appropraitely reward user with tokenized collateral");
  });
});
