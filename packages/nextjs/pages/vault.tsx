import { useState } from "react";
import { Card, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import classNames from "classnames";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import DepositWidget from "~~/components/vault/DepositWidget";
import Withdraw from "~~/components/vault/WithdrawWidget";
import WithdrawWidget from "~~/components/vault/WithdrawWidget";

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
    <div className="flex items-center flex-col flex-grow pt-6 lg:pt-12">
      <Card className="max-w-md mx-auto rounded-3xl lg:mt-0 mt-14 bg-primary">
        <div className="justify-center flex mb-6">
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
              <DepositWidget />
            </div>
          )}
          {activeTab === "withdraw" && (
            <div>
              <WithdrawWidget />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Home;
