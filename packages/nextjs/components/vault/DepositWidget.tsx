import React from "react";
import { useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";

const DepositWidget = () => {
  const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS;
  const [usdcAmount, setUsdcAmount] = useState("");
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

  const handleUsdcChange = (event: any, reset: boolean = false) => {
    if (reset) {
      setUsdcAmount("");
    } else {
      setUsdcAmount(event.target.value);
    }
  };

  interface TransactionReceipt {
    blockHash: string;
  }
  const { writeAsync: deposit_ttdc } = useScaffoldContractWrite({
    contractName: "Vault",
    functionName: "deposit_bTTDC",
    args: [BigInt(multiplyTo1e18(bttdcAmount))],
    // value: parseEther(ethAmount),
    onBlockConfirmation: (txnReceipt: TransactionReceipt) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: deposit_usdc } = useScaffoldContractWrite({
    contractName: "Vault",
    functionName: "deposit_USDC",
    args: [BigInt(multiplyTo1e18(usdcAmount))],
    // value: parseEther(ethAmount),
    onBlockConfirmation: (txnReceipt: TransactionReceipt) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { data: vaultUSDCBalance } = useScaffoldContractRead({
    contractName: "Mock_USDC",
    functionName: "balanceOf",
    args: [vaultAddress],
  });

  const { data: vaultVARTBalance } = useScaffoldContractRead({
    contractName: "VART",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: yourBTTDCBalance } = useScaffoldContractRead({
    contractName: "Backed_bTTDC",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: yourUSDCBalance } = useScaffoldContractRead({
    contractName: "Mock_USDC",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: yourVTTDCBalance } = useScaffoldContractRead({
    contractName: "Vaulted_vTTDC",
    functionName: "balanceOf",
    args: [address],
  });

  // Approve Tokens
  const { writeAsync: approveUsdcTokens } = useScaffoldContractWrite({
    contractName: "Mock_USDC",
    functionName: "approve",
    args: [vaultAddress, multiplyTo1e18("100000000")],
  });

  const { writeAsync: approvevTTDC } = useScaffoldContractWrite({
    contractName: "Vaulted_vTTDC",
    functionName: "approve",
    args: [vaultAddress, multiplyTo1e18("100000000")],
  });

  const { writeAsync: approvebTTDC } = useScaffoldContractWrite({
    contractName: "Backed_bTTDC",
    functionName: "approve",
    args: [vaultAddress, multiplyTo1e18("100000000")],
  });

  const { writeAsync: claimusdcTokens } = useScaffoldContractWrite({
    contractName: "ERC20_USDC_Faucet",
    functionName: "claimTokens",
    // value: parseEther(ethAmount),
    onBlockConfirmation: (txnReceipt: TransactionReceipt) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: claimbttdcTokens } = useScaffoldContractWrite({
    contractName: "ERC20_bTTDC_Faucet",
    functionName: "claimTokens",
    // value: parseEther(ethAmount),
    onBlockConfirmation: (txnReceipt: TransactionReceipt) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="flex px-2 bg-secondary rounded-2xl items-left flex-col pt-2 mb-4 w-full">
          <h1 className="text-center text-lg">Your Balance</h1>
          <div className="mx-8 grid grid-rows-2 grid-flow-col gap-x-8">
            <div className="flex flex-row">
              <div className="pb-1 inline-flex items-center justify-center">
                {parseFloat(formatEther(yourUSDCBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">USDC</h1>
              </div>
            </div>

            <div className="flex flex-row">
              <div className="pb-1 inline-flex items-center justify-center">
                {parseFloat(formatEther(vaultVARTBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">VART</h1>
              </div>
            </div>

            <div className="flex flex-row">
              <div className="pb-1 inline-flex items-center justify-center">
                {parseFloat(formatEther(yourBTTDCBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">bTTDC</h1>
              </div>
            </div>

            <div className="flex flex-row">
              <div className="pb-1 inline-flex items-center justify-center">
                {parseFloat(formatEther(yourVTTDCBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">vTTDC</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-secondary rounded-2xl items-left flex-col flex-grow pt-6 mb-4">
        <div className="mb-6">
          <h1 className="mb-2 ml-3">Deposit TTDC</h1>
          <div className={`flex ml-2 text-accent`}>
            <input
              value={bttdcAmount}
              onChange={handleBttdcChange}
              placeholder="0"
              className="input input-ghost text-3xl focus:outline-none focus:bg-transparent h-[2.2rem] min-h-[2.2rem] px-1 border w-full font-medium placeholder:text-accent/50 text-gray-400"
            />
          </div>
        </div>
      </div>

      <div>
        <button
          className="btn btn-neutral w-full mb-10"
          onClick={() => {
            deposit_ttdc();
            handleBttdcChange(null, true);
          }}
        >
          Deposit
        </button>
      </div>

      <div className="flex bg-secondary rounded-2xl items-left flex-col flex-grow pt-6 mb-4">
        <div className="mb-6">
          <h1 className="mb-2 ml-3">Deposit USDC</h1>
          <div className={`flex ml-2 text-accent`}>
            <input
              value={usdcAmount}
              onChange={handleUsdcChange}
              placeholder="0"
              className="input input-ghost text-3xl focus:outline-none focus:bg-transparent h-[2.2rem] min-h-[2.2rem] px-1 border w-full font-medium placeholder:text-accent/50 text-gray-400"
            />
          </div>
        </div>
      </div>

      <div>
        <button
          className="btn btn-neutral w-full"
          onClick={() => {
            deposit_usdc();
            handleUsdcChange(null, true);
          }}
        >
          Deposit
        </button>
      </div>

      <div className="flex mt-4 bg-secondary rounded-2xl items-left flex-col pt-4 px-6 mb-4">
        <h1 className="text-center text-lg">Vault Collateral</h1>
        <div className="flex flex-row justify-between px-14">
          <div className="pb-1 inline-flex items-center justify-center">
            {parseFloat(formatEther(vaultUSDCBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">USDC</h1>
          </div>
          <div className="pb-1 inline-flex items-center justify-center">
            {parseFloat(formatEther(yourBTTDCBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">bTTDC</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-2 px-2 pt-4">
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => {
              claimbttdcTokens();
            }}
          >
            Claim TTDC
          </button>
        </div>
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => {
              claimusdcTokens();
            }}
          >
            Claim USDC
          </button>
        </div>
        <div className="flex gap-4">
          <button
            className={`btn  ${isApproved ? "btn-disabled" : "btn-secondary"}`}
            onClick={async () => {
              await approveUsdcTokens();
              await approvevTTDC();
              await approvebTTDC();
              setIsApproved(true);
            }}
          >
            Approve Tokens
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositWidget;
