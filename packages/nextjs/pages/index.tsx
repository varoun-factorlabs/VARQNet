import { useState } from "react";
import Link from "next/link";
import { formatEther } from "ethers";
import type { NextPage } from "next";
// import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { Balance, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS;
  const [usdcAmount, setUsdcAmount] = useState("");
  const {address} = useAccount();

  interface TransactionReceipt {
    blockHash: string;
  }

  const { writeAsync: deposit } = useScaffoldContractWrite({
    contractName: "Vault",
    functionName: "deposit_USDC",
    args: [BigInt(multiplyTo1e18(usdcAmount))],
    // value: parseEther(ethAmount),
    onBlockConfirmation: (txnReceipt: TransactionReceipt) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: withdraw } = useScaffoldContractWrite({
    contractName: "Vault",
    functionName: "withdraw_USDC",
    args: [BigInt(multiplyTo1e18(usdcAmount))],
    // value: parseEther(ethAmount),
    onBlockConfirmation: (txnReceipt: TransactionReceipt) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { data: yourUSDCBalance } = useScaffoldContractRead({
    contractName: "Mock_USDC",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: vaultUSDCBalance } = useScaffoldContractRead({
    contractName: "Mock_USDC",
    functionName: "balanceOf",
    args: [vaultAddress],
  });

  return (
    <div className="flex items-center flex-col flex-grow pt-2">
      <div className="tabs tabs-boxed flex justify-between w-screen px-6 pb-4 lg:justify-evenly lg:w-[520px]">
        <Link href="/exchange" className="tab text-xl">
          Exchange
        </Link>
        <Link href="/" className="tab text-xl">
          Vault
        </Link>
        <Link href="/trade" className="tab text-xl">
          Trade
        </Link>
        <Link href="/shift" className="tab text-xl">
          Shift
        </Link>
      </div>

      <div className="w-screen lg:w-[520px] bg-blue-400 rounded">
        <h1 className="text-2xl text-center">Vault Page</h1>
      </div>

      <div className="card w-96 bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h2 className="card-title">Deposit USDC:</h2>
          <EtherInput value={usdcAmount} onChange={amount => setUsdcAmount(amount)} />
          <div className="card-actions justify-end pt-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                deposit();
              }}
            >
              Deposit
            </button>
          </div>
        </div>
      </div>

      <div className="card w-96 bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h2 className="card-title">Withdraw USDC:</h2>
          <EtherInput value={usdcAmount} onChange={amount => setUsdcAmount(amount)} />
          <div className="card-actions justify-end pt-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                withdraw();
              }}
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="text-2xl flex flex-row justify-between items-center pt-4">
        <h1>USDC:</h1>
        <div className="pl-4 pb-2 inline-flex items-center justify-center">
          {parseFloat(formatEther(yourUSDCBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">tokens</h1>
        </div>
      </div>

      <div className="text-2xl flex flex-row items-center">
        <h1>Vault USDC:</h1>
        <div className="pl-4 pb-2 inline-flex items-center justify-center">
          {parseFloat(formatEther(vaultUSDCBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">tokens</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
