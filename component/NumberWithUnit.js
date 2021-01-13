import React, { useState } from 'react';
import { Input, InputNumber, Select } from 'antd';

const NumberWithUni = ({ value = {}, onChange, options, defaultUnit }) => {
  const [number, setNumber] = useState(0);
  const [unit, setUnit] = useState(value.unit || defaultUnit);

  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        number,
        unit,
        ...value,
        ...changedValue,
      });
    }
  };

  const onNumberChange = (newNumber) => {

    if (Number.isNaN(number)) {
      return;
    }

    if (!('number' in value)) {
      setNumber(newNumber);
    }

    triggerChange({
      number: newNumber,
    });
  };

  const onUnitChange = (newUnit) => {
    if (!('unit' in value)) {
        setUnit(newUnit);
    }

    triggerChange({
        unit: newUnit
    });
  };

  return (
    <Input.Group compact style={{ display: 'flex' }}>
      <InputNumber value={value.number} style={{ flex: 1 }} onChange={onNumberChange}></InputNumber>
      <Select value={value.unit || unit}  onChange={onUnitChange}>
        {options.map(({ label, unit }) => (
          <Select.Option value={unit} key={unit}>
            {label}
          </Select.Option>
        ))}
      </Select>
    </Input.Group>
  );
};

export default NumberWithUni;
