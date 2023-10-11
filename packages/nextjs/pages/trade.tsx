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
  const [usdcAmount, setUsdcAmount] = useState("");
  const { address } = useAccount();
  // const [ethAmount, setEthAmount] = useState("");
  const [ttdcAmount, setTtdcAmount] = useState("");
  const [vartAmount, setVartAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("TTDC");

  const handleInputChange = (event: any) => {
    if (selectedToken === "USDC") {
      setUsdcAmount(event.target.value);
    } else if (selectedToken === "VART") {
      setVartAmount(event.target.value);
    }
  };

  const handleTokenSelect = (token: string) => {
    setSelectedToken(token);
  };

  const placeholderText =
    selectedToken === "USDC"
      ? "Enter USDC amount"
      : selectedToken === "VART"
      ? "Enter VART amount"
      : "Enter TTDC amount";

  const { data: vaultVARTBalance } = useScaffoldContractRead({
    contractName: "VART",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: yourVTTDCBalance } = useScaffoldContractRead({
    contractName: "Vaulted_vTTDC",
    functionName: "balanceOf",
    args: [address],
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
        <h1 className="text-2xl text-center">Trade Page</h1>
      </div>

      <div className="items-center flex flex-row w-10/12 justify-between lg:w-1/3">
        <h1 className="text-2xl mt-6 text-left text-blue-400 lg:ml-4">Swap | Buy</h1>
        <div className="mt-4 lg:mr-6">
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
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">You pay</h2>

          {/* <EtherInput value={usdcAmount} onChange={amount => setUsdcAmount(amount)} /> */}
          {/* <div className={`flex border-2 border-base-300 bg-base-200 rounded-full text-accent`}>
            <input
              value={ttdcAmount}
              onChange={handleInputChange}
              className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
            />
          </div>

          <div className="dropdown dropdown-top dropdown-end text-right">
            <label tabIndex={0} className="btn m-1">
              TTDC
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a>USDC</a>
              </li>
              <li>
                <a>VART</a>
              </li>
            </ul>
          </div> */}

          <div className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
            <input
              value={selectedToken === "USDC" ? usdcAmount : vartAmount}
              onChange={handleInputChange}
              placeholder={placeholderText}
              className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
            />
          </div>

          <div className="dropdown dropdown-top dropdown-end text-right">
            <label tabIndex={0} className="btn m-1">
              {selectedToken}
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a onClick={() => handleTokenSelect("USDC")}>USDC</a>
              </li>
              <li>
                <a onClick={() => handleTokenSelect("VART")}>VART</a>
              </li>
              <li>
                <a onClick={() => handleTokenSelect("TTDC")}>TTDC</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card w-96 bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h2 className="card-title">You receive</h2>
          {/* <EtherInput value={ethAmount} onChange={amount => setEthAmount(amount)} /> */}

          <div className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
            <input
              onChange={handleInputChange}
              className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
            />
          </div>

          <div className="dropdown dropdown-top dropdown-end text-right">
            <label tabIndex={0} className="btn m-1">
              VART
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a>USDC</a>
              </li>
              <li>
                <a>vTTDC</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-2xl flex flex-row items-center">
        <h1>VART:</h1>
        <div className="pl-4 pb-2 inline-flex items-center justify-center">
          {parseFloat(formatEther(vaultVARTBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">tokens</h1>
        </div>
      </div>

      <div className="text-2xl flex flex-row items-center">
        <h1>VTTDC:</h1>
        <div className="pl-4 pb-2 inline-flex items-center justify-center">
          {parseFloat(formatEther(yourVTTDCBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">tokens</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
