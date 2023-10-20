import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Card, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import classNames from "classnames";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
// import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { Balance, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";

type CustomTabProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
};

const CustomTab: React.FC<CustomTabProps> = ({ label, isActive, onClick, icon }) => {
  const tabClasses = classNames({
    "bg-secondary shadow-md": isActive,
    "hover:bg-secondary hover:shadow-md": !isActive,
    "py-1.5 px-3 text-2xl rounded-full grid grid-flow-col": true,
  });

  return (
    <button onClick={onClick} className={`${tabClasses} mr-2 `}>
      {icon}
      {label}
    </button>
  );
};

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("deposit");

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-6 lg:pt-28 border-2 border-blue-500">
      <Card className="max-w-md mx-auto rounded-3xl lg:mt-0 mt-14 bg-primary">
        <div className="justify-center flex">
          <CustomTab
            label="Deposit"
            isActive={activeTab === "deposit"}
            onClick={() => handleTabChange("deposit")}
            icon={<UserGroupIcon />}
          />
          <CustomTab
            label="Withdraw"
            isActive={activeTab === "withdraw"}
            onClick={() => handleTabChange("withdraw")}
            icon={<UserIcon />}
          />
        </div>
        <div>
          {activeTab === "deposit" && (
            <div>
              <p>This is the Deposit tab content.</p>
            </div>
          )}
          {activeTab === "withdraw" && (
            <div>
              <p>This is the Withdraw tab content.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Home;
