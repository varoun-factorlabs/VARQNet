import React from "react";
import { useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";

const CashPage = () => {
  const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS;
  const [usdcAmount, setUsdcAmount] = useState("");
  const { address } = useAccount();

  return (
    <div className="flex items-center flex-col flex-grow pt-2 mt-36">
      <EtherInput value={usdcAmount} onChange={amount => setUsdcAmount(amount)} />
      <div>
        <button className="btn btn-secondary mt-4">Button</button>
      </div>
    </div>
  );
};

export default CashPage;
