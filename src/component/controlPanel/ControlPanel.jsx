import React from "react";
import "./ControlPanel.less";
import { Slider } from "antd";
import { Select, Radio } from "antd";
import { Divider } from "antd";
import { Checkbox, Row, Col } from "antd";
import { DatePicker } from "antd";
import "antd/lib/switch/style/index.css";
import "antd/lib/select/style/index.css";
import VisualForms from "./mod/VisualForms";
import { dimension_taxi } from "../../util/const";
import moment from "moment";
const { Option } = Select;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

const precisionRoundMap = {
  low: 50,
  medium: 150,
  high: 300,
};

const clientList = [
  {
    clientName: "client1",
    clientLabel: "Client 1",
  },
  {
    clientName: "client2",
    clientLabel: "Client 2",
  },
  {
    clientName: "client3",
    clientLabel: "Client 3",
  },
  {
    clientName: "client4",
    clientLabel: "Client 4",
  },
  {
    clientName: "client5",
    clientLabel: "Client 5",
  },
  {
    clientName: "client6",
    clientLabel: "Client 6",
  },
  {
    clientName: "client7",
    clientLabel: "Client 7",
  },
  {
    clientName: "client8",
    clientLabel: "Client 8",
  },
];

export default class ControlPanel extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      // 默认
      dataset: "",
      scheme: "query-based",
      dataType: "start",
      dataMode: "fitting",
      precision: "high",
      enableError: false,
      checkedError: false,
      startDate: "2017-05-01",
      endDate: "2017-10-31",
      startHour: "00:00",
      endHour: "23:00",
      dimensionState: [],
      partition: "coarse",
      currentClient: [],
      visualForm: "heatmap",
    };

    this.clientOptions = ["3", "4", "5", "6", "7", "8"];

    this.generateVisualization = this.generateVisualization.bind(this);
    this.updateDatatype = this.updateDatatype.bind(this);
    this.updateDatamode = this.updateDatamode.bind(this);
    this.updatePrecision = this.updatePrecision.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.updateStartHour = this.updateStartHour.bind(this);
    this.updateEndHour = this.updateEndHour.bind(this);
    this.handleDatasetChange = this.handleDatasetChange.bind(this);
    this.updateDimensionState = this.updateDimensionState.bind(this);
    this.updateOrderState = this.updateOrderState.bind(this);
    this.updataTimeRange = this.updataTimeRange.bind(this);
    // this.updateScheme = this.updateScheme.bind(this);
  }
  generateVisualization() {
    // 按api格式拼接日期
    let startTime =
      this.state.startDate.replace(/-/g, "/") + "Z" + this.state.startHour;
    let endTime =
      this.state.endDate.replace(/-/g, "/") + "Z" + this.state.endHour;
    // load data
    this.props.onGenerate({
      dataType: this.state.dataType,
      dataMode: this.state.dataMode,
      startTime: startTime,
      endTime: endTime,
      visualForm: this.state.visualForm,
      // TODO: 加上 modelConfig
    });
  }

  updateVisualForm = (nextVisualForm) => {
    this.setState({ visualForm: nextVisualForm });
  };
  updateDatatype(e) {
    this.setState({
      dataType: e.target.value,
    });
  }
  updateDatamode(e) {
    this.setState({
      dataMode: e.target.value,
      enableError: e.target.value === "fitting",
      checkedError: false,
    });
    this.props.onToggleChartError(false);
  }

  updatePrecision(e) {
    this.setState({
      precision: e.target.value,
    });

    // TODO: add api call
    this.props.onChangePrecision(precisionRoundMap[e.target.value]);
  }

  updateStartDate(e) {
    this.setState({
      startDate: e.target.value,
    });
  }
  updateEndDate(e) {
    this.setState({
      endDate: e.target.value,
    });
  }
  updateStartHour(e) {
    this.setState({
      startHour: e.target.value,
    });
  }
  updateEndHour(e) {
    this.setState({
      endHour: e.target.value,
    });
  }

  isErrorEnabled = () => {
    return this.state.dataMode === "fitting";
  };

  onToggle = (checked) => {
    // error matrix
    this.setState({
      checkedError: checked,
    });
    // TODO: 位置变到中间面板
    this.props.onToggleChartError(checked);
  };

  handleDatasetChange = (value) => {
    console.log(value);
    let { dimensionState } = this.state;
    // console.log(dimensionState);

    switch (value) {
      case "Urban-Mobility dataset":
        dimension_taxi.forEach((x, i) => {
          dimensionState[i] = 0;
        });
      // console.log(dimensionState);
      case "Electronic Health Record Data":
      // TODO:数据集的维度常量需要先定义并引入
    }
    this.setState({
      dataset: value,
      dimensionState: dimensionState,
    });
  };

  updateDimensionState = (index) => {
    let { dimensionState } = this.state;
    this.setState({
      dimensionState: [
        ...dimensionState.slice(0, index),
        dimensionState[index] === 0 ? 1 : 0,
        ...dimensionState.slice(index + 1),
      ],
    });
  };

  updateCurrentClient = (checkedList) => {
    // const { clientList } = this.state;
    this.setState({
      currentClient: checkedList,
    });
  };

  handleClientChange = () => {};

  updateScheme = (e) => {
    // this.setState(e.target.value);
    console.log(e.target.value);
  };

  updateOrderState = (e) => {
    this.setState({ dataType: e.target.value });
  };

  updatePartition = (e) => {
    this.setState({ partition: e.target.value });
  };

  toggleCheckAllClient = () => {
    const nextCheckedAll =
      this.state.currentClient.length !== clientList.length;
    this.setState({
      currentClient: nextCheckedAll
        ? clientList.map(({ clientName }) => clientName)
        : [],
    });
  };

  updataTimeRange(value, dateString) {
    // console.log("Selected Time: ", value);
    // console.log(
    //   "Formatted Selected Time: ",
    //   dateString[0].split(" "),
    //   dateString[1]
    // );
    this.setState({
      startDate: dateString[0].split(" ")[0],
      endDate: dateString[1].split(" ")[0],
      startHour: dateString[0].split(" ")[1],
      endHour: dateString[1].split(" ")[1],
    });
  }

  onOk(value) {
    console.log("onOk: ", value);
  }

  render() {
    const { clientOptions } = this;
    const {
      lngFrom = "",
      lngTo = "",
      latFrom = "",
      latTo = "",
    } = this.props.bbox;

    const {
      dataset,
      dimensionState,
      dataType,
      partition,
      precision,
      dataMode,
      currentClient,
    } = this.state;

    // let currentClient = clientList.reduce((result, d, i) => {
    //   const noneZeroKeys = Object.entries(d)
    //     .filter(([, value]) => value !== 0)
    //     .map(([key]) => key);
    //   return result.concat(noneZeroKeys);
    // }, []);

    console.log(currentClient);
    return (
      <div id="control-panel">
        <div className="panel-title">Configuration View</div>

        <div className="control-panel__data">
          <div className="control-panel__data__item">
            <div>Dataset selection: </div>
            <Select
              defaultValue="Select a dataset"
              style={{
                width: "360px",
                paddingLeft: "10px",
              }}
              onChange={this.handleDatasetChange}
            >
              <Option value="Urban-Mobility dataset">
                Urban-Mobility dataset
              </Option>
              <Option value="Electronic Health Record Data">
                Electronic Health Record Data
              </Option>
            </Select>
          </div>
          <Divider
            style={{ fontSize: "18px", fontWeight: "bold", margin: "10px 0" }}
          >
            Model configuration
          </Divider>
          <div className="control-panel__data__item_twoline">
            <div className="checkbox-all-line">
              <span>Client selection:</span>
              <div>
                <Checkbox
                  onChange={this.toggleCheckAllClient}
                  checked={currentClient.length === clientList.length}
                >
                  Check all
                </Checkbox>
              </div>
            </div>

            <CheckboxGroup
              value={currentClient} // 这里的value需要使用state来获取更新
              onChange={this.updateCurrentClient}
            >
              <div style={{ overflow: "hidden" }}>
                {clientList.map(({ clientName, clientLabel }) => (
                  <div key={clientName} style={{ float: "left", width: "20%" }}>
                    <Checkbox value={clientName}>{clientLabel}</Checkbox>
                  </div>
                ))}
              </div>
            </CheckboxGroup>
          </div>
          <div className="control-panel__data__item_twoline">
            <div>Representation mode:</div>
            <Radio.Group value={dataMode} onChange={this.updateDatamode}>
              {/* TODO：此处的value需要使用state进行控制 */}
              <Radio.Button value="normal">query-based</Radio.Button>
              <Radio.Button value="fitting">prediction-based</Radio.Button>
              <Radio.Button value="centralized">centralized</Radio.Button>
              <Radio.Button value="decentralized">decentralized</Radio.Button>
            </Radio.Group>
          </div>
          <div className="control-panel__data__item">
            <div>Partition granularity:</div>
            <Radio.Group value={partition} onChange={this.updatePartition}>
              {/* TODO：此处的value需要使用state进行控制 */}
              <Radio.Button value="coarse">coarse</Radio.Button>
              <Radio.Button value="medium">medium</Radio.Button>
              <Radio.Button value="fine">fine</Radio.Button>
            </Radio.Group>
          </div>

          <div className="control-panel__data__item">
            <div>Expected precision:</div>
            <Radio.Group value={precision} onChange={this.updatePrecision}>
              {/* TODO：此处的value需要使用state进行控制 */}
              <Radio.Button value="low">low</Radio.Button>
              <Radio.Button value="medium">medium</Radio.Button>
              <Radio.Button value="high">high</Radio.Button>
            </Radio.Group>
          </div>

          <div className="control-panel__data__item_twoline">
            <div>Training parameter:</div>
            <span className="trainingParam">learning rate: 0.055</span>
            <span className="trainingParam">batch size: 12800</span>
            <span className="trainingParam">training round: 50</span>
            <span className="trainingParam">training epoch: 1</span>
          </div>

          <Divider
            style={{ fontSize: "18px", fontWeight: "bold", margin: "10px 0" }}
          >
            Query configuration
          </Divider>

          <div className="control-panel__data__item_twoline">
            <div>Dimension selection:</div>
            {dataset === "Urban-Mobility dataset"
              ? dimension_taxi.map((d, i) => (
                  <span
                    key={i}
                    className={
                      dimensionState[i] === 0
                        ? "dimensions"
                        : "dimensions dimensions_checked"
                    }
                    onClick={() => {
                      this.updateDimensionState(i);
                    }}
                  >
                    {d}
                  </span>
                ))
              : null}
          </div>

          <div className="control-panel__data__item_twoline">
            <div>Filters:</div>
            {dimensionState[
              dimension_taxi.findIndex((item) => item === "time")
            ] === 1 ? (
              <div className="control-panel__data__item">
                <div>time:</div>
                <RangePicker
                  showTime={{ format: "HH:mm" }}
                  format="YYYY-MM-DD HH:mm"
                  defaultValue={[
                    moment("2017-05-01 00:00", "YYYY-MM-DD HH:mm"),
                    moment("2017-10-31 23:00", "YYYY-MM-DD HH:mm"),
                  ]}
                  onChange={this.updataTimeRange}
                  onOk={this.onOk}
                />
              </div>
            ) : null}

            {dimensionState[
              dimension_taxi.findIndex((item) => item === "latitude")
            ] === 1 ? (
              <div className="control-panel__data__item">
                <div>latitude:</div>
                <span className="area_range">
                  {`[` +
                    (latFrom && parseFloat(latFrom).toFixed(3)) +
                    `,` +
                    (latTo && parseFloat(latTo).toFixed(3)) +
                    `]`}
                </span>
                <Slider range defaultValue={[0, 100]} />
              </div>
            ) : null}

            {dimensionState[
              dimension_taxi.findIndex((item) => item === "longitude")
            ] === 1 ? (
              <div className="control-panel__data__item">
                <div>longitude:</div>
                <span className="area_range">
                  {`[` +
                    (lngFrom && parseFloat(lngFrom).toFixed(3)) +
                    `,` +
                    (lngTo && parseFloat(lngTo).toFixed(3)) +
                    `]`}
                </span>
                <Slider range defaultValue={[0, 100]} />
              </div>
            ) : null}

            {dimensionState[
              dimension_taxi.findIndex((item) => item === "orderState")
            ] === 1 ? (
              <div className="control-panel__data__item">
                <div>orderState:</div>
                <Radio.Group value={dataType} onChange={this.updateOrderState}>
                  {/* TODO：此处的value需要使用state进行控制 */}
                  <Radio.Button value="start">start</Radio.Button>
                  <Radio.Button value="end">end</Radio.Button>
                </Radio.Group>
              </div>
            ) : null}
          </div>
          <div className="control-panel__data__item_twoline">
            <VisualForms
              value={this.state.visualForm}
              onChange={this.updateVisualForm}
            />
          </div>
          <div className="control-panel__data__item">
            <button className="load-btn" onClick={this.generateVisualization}>
              Generate Visualization
            </button>
          </div>
        </div>
      </div>
    );
  }
}
