import React, { useMemo } from "react";
import { Slider, DatePicker, Radio } from "antd";
import moment from "moment";

// 写死默认经纬度区域
const LAT_FROM = 19.902;
const LAT_TO = 20.07;
const LNG_FROM = 110.14;
const LNG_TO = 110.52;

const { RangePicker } = DatePicker;

export default function Filters({ dimensions, value, onChange }) {
  const {
    dataType,
    startDate,
    endDate,
    latFrom = LAT_FROM,
    latTo = LAT_TO,
    lngFrom = LNG_FROM,
    lngTo = LNG_TO,
  } = value;
  const updataTimeRange = (_, dateString) => {
    onChange({
      ...value,
      startDate: dateString[0],
      endDate: dateString[1],
    });
  };

  return (
    <div className="control-panel__data__item_twoline">
      <div>Filters:</div>
      {dimensions["time"] ? (
        <div className="control-panel__data__item">
          <div>time:</div>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            value={[
              moment(startDate, "YYYY-MM-DD HH:mm"),
              moment(endDate, "YYYY-MM-DD HH:mm"),
            ]}
            onChange={updataTimeRange}
            // onOk={this.onOk}
          />
        </div>
      ) : null}

      {dimensions["latitude"] ? (
        <div className="control-panel__data__item">
          <div>latitude:</div>
          <span className="area_range">
            {`[` +
              (latFrom ? parseFloat(latFrom).toFixed(3) : "") +
              `,` +
              (latTo ? parseFloat(latTo).toFixed(3) : "") +
              `]`}
          </span>
          {/* TODO */}
          <Slider
            range
            step={0.001}
            min={LAT_FROM}
            max={LAT_TO}
            value={[latFrom, latTo]}
            onChange={(range) => {
              onChange({ ...value, latFrom: range[0], latTo: range[1] });
            }}
          />
        </div>
      ) : null}

      {dimensions["longitude"] ? (
        <div className="control-panel__data__item">
          <div>longitude:</div>
          <span className="area_range">
            {`[` +
              (lngFrom ? parseFloat(lngFrom).toFixed(3) : "") +
              `,` +
              (lngTo ? parseFloat(lngTo).toFixed(3) : "") +
              `]`}
          </span>
          {/* TODO */}
          <Slider
            range
            step={0.001}
            min={LNG_FROM}
            max={LNG_TO}
            value={[lngFrom, lngTo]}
            onChange={(range) => {
              onChange({ ...value, lngFrom: range[0], lngTo: range[1] });
            }}
          />
        </div>
      ) : null}

      {dimensions["orderState"] ? (
        <div className="control-panel__data__item">
          <div>orderState:</div>
          <Radio.Group
            value={dataType}
            onChange={(e) => {
              onChange({
                ...value,
                dataType: e.target.value,
              });
            }}
          >
            <Radio.Button value="start">start</Radio.Button>
            <Radio.Button value="end">end</Radio.Button>
          </Radio.Group>
        </div>
      ) : null}
    </div>
  );
}
