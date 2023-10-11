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
  const [usdcAmount, setUsdcAmount] = useState("");
  const [ttdcAmount, setTtdcAmount] = useState("");

  const handleInputChange = (event: any) => {
    setTtdcAmount(event.target.value);
  };

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
        <h1 className="text-2xl text-center">Exchange Page</h1>
      </div>

      <div className="card w-96 bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h2 className="card-title">TTDC</h2>

          <div className={`flex border-2 border-base-300 bg-base-200 rounded-full text-accent`}>
            <input
              value={ttdcAmount}
              onChange={handleInputChange}
              className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
            />
          </div>

          <div className="card-actions justify-end pt-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                console.log(ttdcAmount);
              }}
            >
              Convert
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button className="btn btn-accent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
            />
          </svg>
        </button>
      </div>

      <div className="card w-96 bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h2 className="card-title">USDC</h2>
          <EtherInput value={usdcAmount} onChange={amount => setUsdcAmount(amount)} />
          <div className="card-actions justify-end pt-4">
            <button className="btn btn-primary">Withdraw</button>
          </div>
        </div>
      </div>

      <div className="text-2xl flex flex-row items-center pt-4">
        <h1>Your Balance:</h1>
        <Balance className="text-xl mb-1" address="0x7A0e13Dd29851e3FE1DDd3Cd3D41Eb161E1DebAD" />
      </div>

      <div className="text-2xl flex flex-row items-center">
        <h1>Vault Balance:</h1>
        <Balance className="text-xl mb-1" address="0x610178dA211FEF7D417bC0e6FeD39F05609AD788" />
      </div>
    </div>
  );
};

export default Home;
