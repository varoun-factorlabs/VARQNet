import React from "react";
import { useState } from "react";
import CurrencyInput from "../swap/CurrencyInput";
// import { Card, Tab, TabGroup, TabList, TabPanels } from "@tremor/react";
import type { NextPage } from "next";
// import { useAccount } from "wagmi";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
// import { MetaHeader } from "~~/components/MetaHeader";
// import { Balance, EtherInput } from "~~/components/scaffold-eth";
import AdvancedOrderWidget from "~~/components/swap/AdvancedOrderWidget";
import LimitOrderWidget from "~~/components/swap/LimitOrderWidget";

// import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
// import { multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";

const DepositWidget = () => {
  const [usdcAmount, setUsdcAmount] = useState("");
  const [ttdcAmount, setTtdcAmount] = useState("");

  const handleTtdcChange = (event: any, reset: boolean = false) => {
    if (reset) {
      setTtdcAmount("");
    } else {
      setTtdcAmount(event.target.value);
    }
  };

  const handleUsdcChange = (event: any, reset: boolean = false) => {
    if (reset) {
        setUsdcAmount("");
    } else {
        setUsdcAmount(event.target.value);
    }
  };

  return (
    <div className="flex bg-secondary rounded-3xl items-center flex-col flex-grow pt-6  border-2 border-red-500">
      <div className="mb-6">
        <h1 className="mb-6">Deposit TTDC</h1>
        <div className={`flex border-2 border-yellow-500 border-base-300 bg-base-200 rounded-full text-accent`}>
          <input
            value={ttdcAmount}
            onChange={handleTtdcChange}
            placeholder="TTDC amount"
            className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
          />
        </div>
      </div>
      <div>
        <h1 className="mb-6">Deposit USDC</h1>
        <div className={`flex border-2 border-yellow-500 border-base-300 bg-base-200 rounded-full text-accent`}>
          <input
            value={usdcAmount}
            onChange={handleUsdcChange}
            placeholder="USDC amount"
            className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default DepositWidget;
