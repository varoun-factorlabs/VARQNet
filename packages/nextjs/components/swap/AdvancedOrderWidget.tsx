import React, { useMemo } from "react";
import TransferWidget from "./TransferWidget";
import { Col, Grid } from "@tremor/react";

const AdvancedOrderWidget = () => {
  const tradeWidgets = useMemo(() => {
    const timeWeighted = <TimeWeightedWidget />;
    return { timeWeighted };
  }, []);

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

const TimeWeightedWidget = () => {
  return (
    <Grid numItems={4} className="gap-2 mt-3">
      <Col numColSpan={4} className="p-5 bg-secondary rounded-lg">
        Price Protection
      </Col>
      <Col numColSpan={4} className="p-5 bg-secondary rounded-lg">
        # of Parts
      </Col>
      <Col numColSpan={2} className="p-5 bg-secondary rounded-lg">
        Duration
      </Col>
      <Col numColSpan={2} className="p-5 bg-secondary rounded-lg">
        Part Duration
      </Col>
      <Col numColSpan={2} className="p-5 bg-secondary rounded-lg">
        Sell Per Part
      </Col>
      <Col numColSpan={2} className="p-5 bg-secondary rounded-lg">
        Buy Per Part
      </Col>
    </Grid>
  );
};

export default AdvancedOrderWidget;
