import React from "react";
import { Radio, Select } from "antd";

const { Option } = Select;

const allCancerSite = [
  "Oral Cavity and Pharynx",
  "Digestive System",
  "Respiratory System",
  "Skin excluding Basal and Squamous",
  "Male and Female Breast",
  "Female Genital System",
  "Male Genital System",
  "Urinary System",
  "Endocrine System",
  "Lymphomas",
  "Leukemias",
];
const allYear = [
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
];
const regions = ["Northeast", "Midwest", "South", "West"];
const sexes = ["Female", "Male"];
const races = [
  "American Indian or Alaska Native",
  "Asian or Pacific Islander",
  "Black or African American",
  "White",
  "Other Races and Unknown combined",
];

export default function Filters({ dimensions, value, onChange }) {
  const { cancerSite, region, sex, race, year } = value;

  return (
    <div className="control-panel__data__item_twoline">
      <div>Filters:</div>
      {dimensions["Cancer Site"] ? (
        <div className="control-panel__data__item">
          <div>Cance Site:</div>
          <Select
            defaultValue="All cancer site"
            style={{
              width: "360px",
              paddingLeft: "10px",
            }}
            onChange={(e) => {
              onChange({
                ...value,
                cancerSite: e,
              });
            }}
          >
            {allCancerSite.map((name) => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </div>
      ) : null}

      {dimensions["Year"] ? (
        <div className="control-panel__data__item">
          <div>Year:</div>
          <Select
            defaultValue="Select a year"
            style={{
              width: "360px",
              paddingLeft: "10px",
            }}
            onChange={(e) => {
              onChange({
                ...value,
                year: e,
              });
            }}
          >
            {allYear.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </div>
      ) : null}

      {dimensions["Region"] ? (
        <div className="control-panel__data__item">
          <div>Region:</div>
          <Radio.Group
            value={region}
            onChange={(e) => {
              onChange({
                ...value,
                region: e.target.value,
              });
            }}
          >
            {regions.map((r) => (
              <Radio.Button key={r} value={r}>
                {r}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      ) : null}

      {dimensions["Sex"] ? (
        <div className="control-panel__data__item">
          <div>Sex:</div>
          <Radio.Group
            value={sex}
            onChange={(e) => {
              onChange({
                ...value,
                sex: e.target.value,
              });
            }}
          >
            {sexes.map((sex) => (
              <Radio.Button key={sex} value={sex}>
                {sex}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      ) : null}

      {dimensions["Race"] ? (
        <div className="control-panel__data__item">
          <div>Race:</div>
          <Select
            defaultValue="Select a race"
            style={{
              width: "360px",
              paddingLeft: "10px",
            }}
            onChange={(e) => {
              onChange({
                ...value,
                race: e,
              });
            }}
          >
            {races.map((race) => (
              <Radio.Button key={race} value={race}>
                {race}
              </Radio.Button>
            ))}
          </Select>
        </div>
      ) : null}
    </div>
  );
}
