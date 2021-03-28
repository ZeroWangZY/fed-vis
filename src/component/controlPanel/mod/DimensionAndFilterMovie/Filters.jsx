import React from "react";
import { Slider, Radiom, Select } from "antd";
const { Option } = Select;

const allTitle = [
  "Godfather, The (1972)",
  "Star Wars: Episode IV - A New Hope (1977)",
  "Titanic (1997)",
  "Princess Bride, The (1987)",
];

export default function Filters({ dimensions, value, onChange }) {
  const { title, rating } = value;

  return (
    <div className="control-panel__data__item_twoline">
      <div>Filters:</div>
      {dimensions["Title"] ? (
        <div className="control-panel__data__item">
          <div>Title:</div>
          <Select
            defaultValue="Select a movie title"
            style={{
              width: "360px",
              paddingLeft: "10px",
            }}
            onChange={(e) => {
              onChange({
                ...value,
                title: e,
              });
            }}
          >
            {allTitle.map((name) => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </div>
      ) : null}

      {dimensions["Rating"] ? (
        <div className="control-panel__data__item">
          <div>Rating:</div>
          <Slider
            range
            step={1}
            min={1}
            max={5}
            value={[1, 5]}
            // onChange={(range) => {
            //   onChange({ ...value, latFrom: range[0], latTo: range[1] });
            // }}
          />
        </div>
      ) : null}
    </div>
  );
}
