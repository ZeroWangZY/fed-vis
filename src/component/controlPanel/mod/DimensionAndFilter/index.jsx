import React, { useState, useEffect } from "react";
import Dimension from "./Dimension";
import { connect } from "react-redux";
import Filters from "./Filters";

export function DimensionAndFilter({ bbox, dataset, onChange }) {
  const [filters, _setFilters] = useState({});
  const [dimensions, setDimensions] = useState([]);
  useEffect(() => {
    setDimensions({});
    handleFiltersChange({
      dataType: "start",
      startDate: "2017-05-01 00:00",
      endDate: "2017-10-31 23:00",
      ...bbox,
    });
  }, [dataset]);
  // bbox 更改后，重置 bbox 的值
  useEffect(() => {
    handleFiltersChange({
      ...filters,
      ...bbox,
    });
  }, [bbox]);
  const handleFiltersChange = (nextFilters) => {
    _setFilters(nextFilters);
    onChange(nextFilters);
  };
  return (
    <>
      <div className="control-panel__data__item_twoline">
        <div>Dimension selection:</div>
        {dataset ? (
          <Dimension
            dataset={dataset}
            value={dimensions}
            onChange={setDimensions}
          />
        ) : null}
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
export default connect(mapStateToProps)(DimensionAndFilter);
