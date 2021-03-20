import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import heatmap from "../../../assets/img/heatmap.svg";
import barchart from "../../../assets/img/barchart.svg";
import treemap from "../../../assets/img/treemap.svg";
import sankey from "../../../assets/img/sankey.svg";
import odmap from "../../../assets/img/odmap.svg";
import pie from "../../../assets/img/pie.svg";
import rada from "../../../assets/img/rada.svg";
import linechart from "../../../assets/img/linechart.svg";
import bubble from "../../../assets/img/bubble.svg";
import clsx from "clsx";

const formsList = [
  { type: "heatmap", svgSrc: heatmap, title: "Heatmap" },
  { type: "barchart", svgSrc: barchart, title: "Barchart" },
  { type: "treemap", svgSrc: treemap, title: "Linechart" },
  { type: "sankey", svgSrc: sankey, title: "Radar diagram" },
  { type: "odmap", svgSrc: odmap, title: "Sankey diagram" },
  { type: "pie", svgSrc: pie, title: "Pie chart" },
  { type: "rada", svgSrc: rada, title: "Treemap" },
  { type: "linechart", svgSrc: linechart, title: "Bubble diagram" },
  { type: "bubble", svgSrc: bubble, title: "ODmap" },
];

function FormBtn({ type, title, svgSrc, active, onClick }) {
  const handleClick = () => {
    onClick(type);
  };
  return (
    <button
      className={clsx("visual-form-item", {
        "visual-form-item-active": active,
      })}
      title={title}
      onClick={handleClick}
    >
      <img src={svgSrc} alt={title} />
    </button>
  );
}

export default function VisualForms({ value, onChange }) {
  return (
    <>
      <div>Visual forms:</div>
      {formsList.map((conf, index) => (
        <FormBtn
          key={index}
          {...conf}
          active={value === conf.type}
          onClick={onChange}
        />
      ))}
    </>
  );
}

VisualForms.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOf(formsList.map(({ type }) => type)),
};
