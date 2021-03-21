import React, { useMemo } from "react";
import { Tag } from "antd";
import { dimension_taxi } from "util/const";

const { CheckableTag } = Tag;

export default function ({ dataset, value, onChange }) {
  const dimensionList = useMemo(() => {
    if (dataset === "Urban-Mobility dataset") {
      return dimension_taxi;
    }
    // TODO: 针对拎一个数据集定制 dimension taxi
    return null;
  }, [dataset]);

  const handleChange = (dimension, checked) => {
    onChange({
      ...value,
      [dimension]: checked,
    });
  };

  if (!dimensionList) return null;
  return (
    <>
      {dimensionList.map((dimension) => (
        <CheckableTag
          key={dimension}
          checked={value[dimension]}
          onChange={(checked) => handleChange(dimension, checked)}
          style={{ fontSize: "14px" }}
        >
          {dimension}
        </CheckableTag>
      ))}
    </>
  );
}
