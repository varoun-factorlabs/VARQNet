import React from "react";
import TransferWidget from "./TransferWidget";

const SwapWidget = () => {
  return (
    <TransferWidget
      token0={""}
      token1={""}
      token0Amount={0}
      token1Amount={0}
      tradeWidgets={{}}
      onChange={function (token: string, value: number): void {
        console.log(token, value);
        throw new Error("Function not implemented.");
      }}
      onTranspose={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
};

export default SwapWidget;
