import { SelectList } from "react-native-dropdown-select-list";
import React from "react";

export default function Dropdown() {
  const [selected, setSelected] = React.useState("");

  const data = [
    { key: "1", value: "Meat" },
    { key: "2", value: "Fruit" },
    { key: "3", value: "Vegetable" },
    { key: "4", value: "Drink" },
  ];

  return (
    <SelectList
      setSelected={(val) => setSelected(val)}
      data={data}
      save="value"
      boxStyles={{ width: 300, marginBottom: 15 }}
    />
  );
}
