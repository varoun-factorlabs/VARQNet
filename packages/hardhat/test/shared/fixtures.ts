import { ethers } from "hardhat";
import { MockERC20, VaultManager } from "../../typechain-types";
import { Fixture, MockProvider } from "ethereum-waffle";
import { Wallet } from "ethers";
import { e18 } from "./math";

type TokensFixture = {
  usdc: MockERC20;
  bttd: MockERC20;
};

type StandaloneVaultFixture = {
  vart: MockERC20;
  vttd: MockERC20;
} & TokensFixture;

type VaultManagerFixture = {
  manager: VaultManager;
} & StandaloneVaultFixture;

export const tokensFixture: Fixture<TokensFixture> = async (): Promise<TokensFixture> => {
  // @note Deploy all ERC20 Collateral Tokens
  const tokenFactory = await ethers.getContractFactory("MockERC20");
  const usdc = (await tokenFactory.deploy("USD Coin", "USDC")) as MockERC20;
  const bttd = (await tokenFactory.deploy("Bank TTD", "BTTD")) as MockERC20;
  return {
    usdc,
    bttd,
  };
};

export const vaultManagerFixture: Fixture<VaultManagerFixture> = async (
  wallets: Wallet[],
  provider: MockProvider,
): Promise<VaultManagerFixture> => {
  const { usdc, bttd } = await tokensFixture(wallets, provider);
  const managerFactory = await ethers.getContractFactory("VaultManager");
  const manager = (await managerFactory.deploy(usdc.address, bttd.address)) as VaultManager;
  const vart = (await ethers.getContractAt("MockERC20", await manager._vaulted(usdc.address))) as MockERC20;
  const vttd = (await ethers.getContractAt("MockERC20", await manager._vaulted(bttd.address))) as MockERC20;
  await usdc.transfer(manager.address, e18(1));
  await bttd.transfer(manager.address, e18(1));
  return { usdc, bttd, vart, vttd, manager };
};
