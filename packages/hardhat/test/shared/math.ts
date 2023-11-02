import { ethers } from "hardhat";

export const e18 = (n: number) => {
  return ethers.utils.parseEther(n.toString());
};

export const now = () => {
  return new Date().getTime();
};
