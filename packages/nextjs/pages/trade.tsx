import React from "react";
import { Card, Tab, TabGroup, TabList, TabPanels } from "@tremor/react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { Balance, EtherInput } from "~~/components/scaffold-eth";
import AdvancedOrderWidget from "~~/components/swap/AdvancedOrderWidget";
import LimitOrderWidget from "~~/components/swap/LimitOrderWidget";
import SwapWidget from "~~/components/swap/SwapWidget";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";

const Home: NextPage = () => {
  const { address } = useAccount();

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
    <div className="flex items-center flex-col flex-grow pt-6 lg:pt-28">
      <Card className="max-w-md mx-auto">
        <TabGroup>
          <TabList className="mt-8">
            <Tab icon={UserGroupIcon}>Swap</Tab>
            <Tab icon={UserIcon}>Limit Order</Tab>
            <Tab icon={UserIcon}>TWAP</Tab>
          </TabList>
          <TabPanels>
            <SwapWidget />
            <LimitOrderWidget />
            <AdvancedOrderWidget />
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
};

export default Home;
