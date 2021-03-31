import React, {useState, useEffect} from "react";
import "./clientCard.less";
import * as d3 from "d3";
import PerformanceLinechart from "./PerformanceLinechart";
import Chart from 'components/chart';
import { connect } from "react-redux";

// 在选择client以后，更新当前选择client的数据 state
// 在选择visual form以后，更新当前可视化图表类型，然后dispatch到各个view

function ClientCard(props) {
  const { id, diagram_data, visualForm, loss, re, currentRound } = props;
  const [lossList, setLossList] = useState([]);
  const [reList, setReList] = useState([]);
  useEffect(() => {
    setLossList(lossList.concat({
      x: currentRound,
      y:loss
    }));
  }, [loss])
  useEffect(() => {
    setReList(reList.concat({
      x: currentRound,
      y:re
    }));
  }, [re])
  
// debugger
    return (
      <div className="client-card">
        <div className="card-head">{"Client" + id}</div>
        <div className="card-body">
          <div className="client-result">
            <Chart visualForm={visualForm} chartNerror={diagram_data} useError={false} position={"client"} panelID={"Client" + id}/>
          </div>
          <div className="client-performance">
            {/* 两个折线图 */}
            <PerformanceLinechart type={"loss"} data={lossList} />
            <PerformanceLinechart type={"error"} data={reList} />
          </div>
        </div>
      </div>
    );
}

const mapStateToProps = (state, props) => ({
  data: state.clientInfo[props.clientNo],
});
export default connect(mapStateToProps)(ClientCard);
