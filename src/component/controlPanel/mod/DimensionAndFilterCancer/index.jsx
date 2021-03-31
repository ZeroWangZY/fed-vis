import React, { useState, useEffect } from "react";
import Dimension from "./Dimension";
import { connect } from "react-redux";
import Filters from "./Filters";

export function DimensionAndFilterCancer({ bbox, onChange }) {
  const [filters, _setFilters] = useState({});
  const [dimensions, setDimensions] = useState([]);
  useEffect(() => {
    setDimensions({});
    handleFiltersChange({
      // cancerSite, region, sex, race, year
      cancerSite: "All cancer site",
      region: "Northeast",
      sex:"Female",
    });
  }, []);
  
  const handleFiltersChange = (nextFilters) => {
    _setFilters(nextFilters);
    onChange(nextFilters);
  };
  return (
    <>
      <div className="control-panel__data__item_twoline">
        <div>Dimension selection:</div>

        <Dimension value={dimensions} onChange={setDimensions} />
      </div>
      <Filters
        dimensions={dimensions}
        value={filters}
        onChange={handleFiltersChange}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    bbox: state.bbox,
  };
};
export default connect(mapStateToProps)(DimensionAndFilterCancer);
