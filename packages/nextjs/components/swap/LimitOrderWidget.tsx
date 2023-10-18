import React, { useMemo } from "react";
import CurrencyInput from "./CurrencyInput";
import TransferWidget from "./TransferWidget";
import { Col, Grid } from "@tremor/react";

const LimitOrderWidget = () => {
  const [limitPrice, setLimitPrice] = React.useState(0);

  const tradeWidgets = useMemo(() => {
    const priceLimit = <LimitPriceWidget value={limitPrice} onChange={setLimitPrice} />;
    return { priceLimit };
  }, [limitPrice]);

  return (
    <TransferWidget
      token0={""}
      token1={""}
      token0Amount={0}
      token1Amount={0}
      tradeWidgets={tradeWidgets}
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

type LimitPriceWidgetProps = {
  value: number;
  onChange: (value: number) => void;
};

const LimitPriceWidget = (props: LimitPriceWidgetProps) => {
  const { value, onChange } = props;
  return (
    <Grid numItems={3} className="gap-2 m-3">
      <Col numColSpan={2} className="p-5 bg-primary rounded-lg">
        Price Limit
        <CurrencyInput {...{ value, onChange }} />
      </Col>
      <Col numColSpan={1} className="p-5 bg-primary rounded-lg">
        Expiry
      </Col>
    </Grid>
  );
};

export default LimitOrderWidget;
