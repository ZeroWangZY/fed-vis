import React from "react";
import IconBtn from "./IconBtn";
import { ReactComponent as OneDimensionSvg } from "assets/img/one_dimension.svg";
import { ReactComponent as TwoDimensionSvg } from "assets/img/two_dimension.svg";
import { ReactComponent as FourDimensionSvg } from "assets/img/four_dimension.svg";
import { ReactComponent as HierarchySvg } from "assets/img/hierarchy.svg";

export default ({ dimension }) => {
  return (
    <IconBtn
      title={dimension}
      component={
        {
          hierarchy: HierarchySvg,
          one_dimension: OneDimensionSvg,
          two_dimension_polar: TwoDimensionSvg,
          two_dimension_map: TwoDimensionSvg,
          four_dimension: FourDimensionSvg,
        }[dimension]
      }
      noBorder
    />
  );
};
