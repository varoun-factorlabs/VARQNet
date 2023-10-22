import React, { ChangeEvent, useCallback } from "react";
import { NumberInput } from "@tremor/react";
import { CurrencyDollarIcon } from "@heroicons/react/20/solid";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

const CurrencyInput = (props: Props) => {
  const { value, onChange } = props;

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      onChange(value);
    },
    [onChange],
  );

  return <NumberInput className="bg-secondary rounded-full" icon={CurrencyDollarIcon} placeholder="0.0" value={value} onChange={handleChange} />;
};

export default CurrencyInput;
