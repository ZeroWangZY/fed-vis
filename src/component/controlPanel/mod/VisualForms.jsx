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
import { selectBarchart } from "../../../actions/barchart";

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

function FormBtn({ type, title, svgSrc, onClick }) {
  const handleClick = () => {
    onClick(type);
  };
  return (
    <button className="visualForm" title={title} onClick={handleClick}>
      <img src={svgSrc} alt={title} />
    </button>
  );
}

export class VisualForms extends Component {
  render() {
    const { onSelect } = this.props;
    return (
      <>
        <div>Visual forms:</div>
        {formsList.map((conf, index) => (
          <FormBtn key={index} {...conf} onClick={onSelect} />
        ))}
      </>
    );
  }
}

VisualForms.propTypes = {
  onSelect: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    onSelect: (type) => dispatch(selectBarchart(type)),
  };
}

export default connect(() => ({}), mapDispatchToProps)(VisualForms);
