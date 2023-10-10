import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { parseEther } from "viem";
// import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { Balance, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";

const Home: NextPage = () => {
  const [vttdcAmount, setVttdcAmount] = useState("");
  const [bttdcAmount, setBttdcAmount] = useState("");

  const handleBttdcChange = (event: any) => {
    setBttdcAmount(event.target.value);
  };

  const handleVttdcChange = (event: any) => {
    setVttdcAmount(event.target.value);
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

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
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

      <h1 className="text-2xl border-2 border-red-500">Shift Tab</h1>

      <div className="card w-96 bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h2 className="card-title">vTTDC:</h2>

          <div className={`flex border-2 border-base-300 bg-base-200 rounded-full text-accent`}>
            <input
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
              }}
            >
              Withdraw
            </button>
          </div>
        </div>
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
              }}
            >
              Deposit
            </button>
          </div>
        </div>
      </div>

      <div className="text-2xl flex flex-row items-center p-4">
        <h1>Your Balance:</h1>
        <Balance className="text-xl mb-1" address="0x7A0e13Dd29851e3FE1DDd3Cd3D41Eb161E1DebAD" />
      </div>

      <div className="text-2xl flex flex-row items-center p-4">
        <h1>Vault Balance:</h1>
        <Balance className="text-xl mb-1" address="0x610178dA211FEF7D417bC0e6FeD39F05609AD788" />
      </div>
    </div>
  );
};

export default Home;
