import React, { ReactNode, useCallback } from "react";
import CurrencyInput from "./CurrencyInput";
import { Button, TabPanel } from "@tremor/react";

export interface TradeWidgetSlots {
  priceLimit?: ReactNode;
  timeWeighted?: ReactNode;
}

type Props = {
  token0: string;
  token1: string;
  token0Amount: number;
  token1Amount: number;
  tradeWidgets: TradeWidgetSlots;
  onChange: (token: string, value: number) => void;
  onTranspose: () => void;
};

const TransferWidget = (props: Props) => {
  const { token0, token1, token0Amount, token1Amount, onChange, onTranspose, tradeWidgets } = props;

  const { priceLimit, timeWeighted } = tradeWidgets;

  const handleTokenInChange = useCallback(
    (value: number) => {
      onChange(token0, value);
    },
    [onChange, token0],
  );

  const handleTokenOutChange = useCallback(
    (value: number) => {
      onChange(token1, value);
    },
    [onChange, token1],
  );

  const handleTransposeTokens = useCallback(() => {
    onTranspose();
  }, [onTranspose]);

  return (
    <TabPanel>
      <div className="mt-10">
        <CurrencyInput value={token0Amount} onChange={handleTokenInChange} />
        <div>{priceLimit && priceLimit}</div>
        <div className="row py-5 flex justify-center">
          <Button className="rounded-full px-8 bg-secondary" size="md" onClick={handleTransposeTokens}>
            SWAP
          </Button>
        </div>
        <CurrencyInput value={token1Amount} onChange={handleTokenOutChange} />
        {timeWeighted && timeWeighted}
      </div>
    </TabPanel>
  );
};

export default TransferWidget;
