import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ReactComponent as heatmap } from "assets/img/heatmap.svg";
import { ReactComponent as barchart } from "assets/img/barchart.svg";
import { ReactComponent as treemap } from "assets/img/treemap.svg";
import { ReactComponent as sankey } from "assets/img/sankey.svg";
import { ReactComponent as odmap } from "assets/img/odmap.svg";
import { ReactComponent as pie } from "assets/img/pie.svg";
import { ReactComponent as rada } from "assets/img/radar.svg";
import { ReactComponent as linechart } from "assets/img/linechart.svg";
import { ReactComponent as bubble } from "assets/img/packing.svg";
import { ReactComponent as scatterplot } from "assets/img/scatterplot.svg";
import { ReactComponent as grouped_histogram } from "assets/img/grouped_histogram.svg";
import { ReactComponent as polar_heatmap } from "assets/img/polar_heatmap.svg";
import IconBtn from "./IconBtn";
import { selectBarchart } from "actions/barchart";

const formsList = [
  {
    type: "heatmap",
    dimension: "two_dimension_map",
    component: heatmap,
    title: "Heatmap",
  },
  {
    type: "barchart",
    dimension: "one_dimension",
    component: barchart,
    title: "Barchart",
  },
  {
    type: "treemap",
    dimension: "hierarchy",
    component: treemap,
    title: "Treemap",
  },
  {
    type: "sankey",
    dimension: "four_dimension",
    component: sankey,
    title: "Sankey diagram",
  },
  {
    type: "odmap",
    dimension: "four_dimension",
    component: odmap,
    title: "ODmap",
  },
  {
    type: "pie",
    dimension: "one_dimension",
    component: pie,
    title: "Pie chart",
  },
  {
    type: "rada",
    dimension: "one_dimension",
    component: rada,
    title: "Radar diagram",
  },
  {
    type: "linechart",
    dimension: "one_dimension",
    component: linechart,
    title: "Linechart",
  },
  {
    type: "packing",
    dimension: "hierarchy",
    component: bubble,
    title: "Circle packing",
  },
  {
    type: "scatterplot",
    dimension: "two_dimension_polar",
    component: scatterplot,
    title: "Scatterplot",
  },
  {
    type: "groupedBar",
    dimension: "two_dimension_polar",
    component: grouped_histogram,
    title: "Grouped Histogram",
  },
  {
    type: "polar",
    dimension: "two_dimension_polar",
    component: polar_heatmap,
    title: "Polar heatmap",
  },
];

function FormBtn({ type, title, component, dimension, onClick, active }) {
  const handleClick = () => {
    onClick({ type, dimension });
  };
  return (
    <IconBtn
      component={component}
      active={active}
      onClick={handleClick}
      title={title}
      style={{ marginTop: "5px" }}
    />
  );
}

export default class VisualForms extends Component {
  render() {
    const { onSelect, value } = this.props;
    console.log(formsList, value);
    return (
      <>
        <div>Visual forms:</div>
        <div style={{ marginLeft: "-10px" }}>
          {formsList.map((conf, index) => (
            <FormBtn
              key={index}
              {...conf}
              onClick={onSelect}
              active={conf.type === value}
            />
          ))}
        </div>
      </>
    );
  }
}

VisualForms.propTypes = {
  onSelect: PropTypes.func,
};
