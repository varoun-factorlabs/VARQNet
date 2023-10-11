import { useState } from "react";
import Link from "next/link";
import { formatEther } from "ethers";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { Balance, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";

const Home: NextPage = () => {
  const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS;
  const [vttdcAmount, setVttdcAmount] = useState("");
  const [bttdcAmount, setBttdcAmount] = useState("");
  const { address } = useAccount();
  const [isApproved, setIsApproved] = useState(false);

  const handleBttdcChange = (event: any, reset: boolean = false) => {
    if (reset) {
      setBttdcAmount("");
    } else {
      setBttdcAmount(event.target.value);
    }
  };

  const handleVttdcChange = (event: any, reset: boolean = false) => {
    if (reset) {
      setVttdcAmount("");
    } else {
      setVttdcAmount(event.target.value);
    }
  };

  interface TransactionReceipt {
    blockHash: string;
  }
  const { writeAsync: deposit } = useScaffoldContractWrite({
    contractName: "Vault",
    functionName: "deposit_bTTDC",
    args: [BigInt(multiplyTo1e18(bttdcAmount))],
    // value: parseEther(ethAmount),
    onBlockConfirmation: (txnReceipt: TransactionReceipt) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: withdraw_vttdc } = useScaffoldContractWrite({
    contractName: "Vault",
    functionName: "withdraw_bTTDC",
    args: [BigInt(multiplyTo1e18(vttdcAmount))],
    // value: parseEther(ethAmount),
    onBlockConfirmation: (txnReceipt: TransactionReceipt) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { data: yourBTTDCBalance } = useScaffoldContractRead({
    contractName: "Backed_bTTDC",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: yourVTTDCBalance } = useScaffoldContractRead({
    contractName: "Vaulted_vTTDC",
    functionName: "balanceOf",
    args: [address],
  });

  // // Approve Tokens
  const { writeAsync: approvebTTDC } = useScaffoldContractWrite({
    contractName: "Backed_bTTDC",
    functionName: "approve",
    args: [vaultAddress, multiplyTo1e18("100000000")],
  });

  const { writeAsync: approvevTTDC } = useScaffoldContractWrite({
    contractName: "Vaulted_vTTDC",
    functionName: "approve",
    args: [vaultAddress, multiplyTo1e18("100000000")],
  });

  const { writeAsync: claimTokens } = useScaffoldContractWrite({
    contractName: "ERC20_bTTDC_Faucet",
    functionName: "claimTokens",
    // value: parseEther(ethAmount),
    onBlockConfirmation: (txnReceipt: TransactionReceipt) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
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
        <h1 className="text-2xl text-center">Shift Page</h1>
      </div>

      <div className="card w-96 bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h2 className="card-title">bTTDC:</h2>
          <div className={`flex border-2 border-base-300 bg-base-200 rounded-full text-accent`}>
            <input
              value={bttdcAmount}
              onChange={handleBttdcChange}
              className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
            />
          </div>
          <div className="card-actions justify-end pt-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                deposit();
                handleBttdcChange(null, true);
              }}
            >
              Deposit
            </button>
          </div>
        </div>
      </div>

      <div className="card w-96 bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h2 className="card-title">vTTDC:</h2>

          <div className={`flex border-2 border-base-300 bg-base-200 rounded-full text-accent`}>
            <input
              id="vttdc"
              value={vttdcAmount}
              onChange={handleVttdcChange}
              className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
            />
          </div>

          <div className="card-actions justify-end pt-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                withdraw_vttdc();
                handleVttdcChange(null, true);
              }}
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="text-2xl flex flex-row justify-between items-center pt-4">
        <h1>BTTDC:</h1>
        <div className="pl-4 pb-2 inline-flex items-center justify-center">
          {parseFloat(formatEther(yourBTTDCBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">tokens</h1>
        </div>
      </div>

      <div className="text-2xl flex flex-row items-center">
        <h1>VTTDC:</h1>
        <div className="pl-4 pb-2 inline-flex items-center justify-center">
          {parseFloat(formatEther(yourVTTDCBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">tokens</h1>
        </div>
      </div>

      <div className="flex flex-row justify-between w-8/12">
        <div className="flex gap-4">
          <button
            className={`btn  ${isApproved ? "btn-disabled" : "btn-primary"}`}
            onClick={async () => {
              await approvebTTDC();
              await approvevTTDC();
              setIsApproved(true);
            }}
          >
            Approve Tokens
          </button>
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => {
              claimTokens();
            }}
          >
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
