import React from "react";
import { Card, Tab, TabGroup, TabList, TabPanels } from "@tremor/react";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import AdvancedOrderWidget from "~~/components/swap/AdvancedOrderWidget";
import LimitOrderWidget from "~~/components/swap/LimitOrderWidget";
import SwapWidget from "~~/components/swap/SwapWidget";

const Page = () => {
  return (
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
  );
};

export default Page;
