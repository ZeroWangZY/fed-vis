import React, { useMemo } from "react";
import { Tag } from "antd";
import { dimension_movie } from "util/const";

const { CheckableTag } = Tag;

export default function ({ value, onChange }) {
  const dimensionList = dimension_movie;

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
