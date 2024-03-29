import React, { useState, useEffect } from "react";
import Dimension from "./Dimension";
import { connect } from "react-redux";
import Filters from "./Filters";

export function DimensionAndFilterUrban({ bbox, onChange }) {
  const [filters, _setFilters] = useState({});
  const [dimensions, setDimensions] = useState([]);
  // bbox 更改后，重置 bbox 的值
  useEffect(() => {
    handleFiltersChange({
      ...filters,
      ...bbox,
    });
  }, [bbox]);

  useEffect(() => {
    setDimensions({});
    handleFiltersChange({
      dataType: "start",
      startDate: "2017-05-01 00:00",
      endDate: "2017-10-31 23:00",
      ...bbox,
    });
  }, []);

  const handleFiltersChange = (nextFilters) => {
    _setFilters(nextFilters);
    onChange(nextFilters);
  };
  console.log({ filters });
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
export default connect(mapStateToProps)(DimensionAndFilterUrban);
