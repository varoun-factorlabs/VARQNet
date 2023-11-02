import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "ethereum-waffle";
import { ethers } from "hardhat";
import { vaultManagerFixture } from "./shared/fixtures";
import { expect } from "chai";
import { ERC20, MockERC20, VaultManager } from "../typechain-types";
import { e18 } from "./shared/math";

describe("Vault Manager", function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let deployer: SignerWithAddress, alice: SignerWithAddress, signers: SignerWithAddress[];
  let usdc: ERC20, bttd: ERC20, manager: VaultManager, vart: MockERC20, vttd: MockERC20;

  beforeEach(async function () {
    [deployer, alice, ...signers] = await (ethers as any).getSigners();
    ({ usdc, bttd, manager, vart, vttd } = await loadFixture(vaultManagerFixture));
  });

  describe("Initialization", function () {
    it("manager is owned by the deployer", async () => {
      expect(await manager.owner()).to.equal(deployer.address);
    });

    it("deploys two tokenized vaults", async () => {
      expect(await manager._vaulted(usdc.address)).to.equal(vart.address);
      expect(await manager._vaulted(bttd.address)).to.equal(vttd.address);
    });

    it("manager has collateral tokens", async () => {
      expect(await usdc.balanceOf(manager.address)).to.equal(e18(1));
      expect(await bttd.balanceOf(manager.address)).to.equal(e18(1));
    });

    it("manager has collateral locked in the vault", async () => {
      expect(await usdc.balanceOf(vart.address)).to.equal(e18(0));
      expect(await bttd.balanceOf(vttd.address)).to.equal(e18(0));
    });
  });

  describe("Exchange::USD to TTD::Price Premium", function () {
    beforeEach(async () => {
      await manager.connect(alice).tap(usdc.address, e18(1));
    });
  });

  describe("Deposit:USD to TTD,VART::No Premium", function () {
    beforeEach(async () => {
      await manager.connect(alice).tap(usdc.address, e18(1));
    });

    describe("Approved", async () => {
      beforeEach(async () => {
        await usdc.connect(alice).approve(manager.address, e18(1));
        await manager.connect(alice).deposit(usdc.address, e18(1));
      });

      it("receives USD 1:7 VTTD", async () => {
        expect(await usdc.balanceOf(alice.address)).to.equal(e18(0));
        expect(await vttd.balanceOf(alice.address)).to.equal(e18(7));
      });

      it("receives USD 1:1 VART", async () => {
        expect(await usdc.balanceOf(alice.address)).to.equal(e18(0));
        expect(await vart.balanceOf(alice.address)).to.equal(e18(1));
      });
    });
  });
});
