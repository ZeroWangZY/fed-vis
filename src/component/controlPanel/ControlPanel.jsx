import React from "react";
import "./ControlPanel.less";
import { Slider } from "antd";
import { Select, Radio } from "antd";
import { Divider } from "antd";
import { Checkbox, Row, Col } from "antd";
import { DatePicker } from "antd";
import "antd/lib/switch/style/index.css";
import "antd/lib/select/style/index.css";
import heatmap from "../../assets/img/heatmap.svg";
import barchart from "../../assets/img/barchart.svg";
import treemap from "../../assets/img/treemap.svg";
import sankey from "../../assets/img/sankey.svg";
import violin from "../../assets/img/violin.svg";
import pie from "../../assets/img/pie.svg";
import rada from "../../assets/img/rada.svg";
import linechart from "../../assets/img/linechart.svg";
import bubble from "../../assets/img/bubble.svg";
const { Option } = Select;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const allValues = [
  "client1",
  "client2",
  "client3",
  "client4",
  "client5",
  "client6",
  "client7",
  "client8",
];

const precisionRoundMap = {
  low: 50,
  medium: 150,
  high: 300,
};

export default class ControlPanel extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      // 默认
      scheme: "query-based",
      dataType: "start",
      dataMode: "normal",
      precision: "high",
      enableError: false,
      checkedError: false,
      startDate: "2017-05-01",
      endDate: "2017-10-31",
      startHour: "00:00",
      endHour: "23:00",
    };

    this.clientOptions = ["3", "4", "5", "6", "7", "8"];

    this.handleLoadClick = this.handleLoadClick.bind(this);
    this.updateDatatype = this.updateDatatype.bind(this);
    this.updateDatamode = this.updateDatamode.bind(this);
    this.updatePrecision = this.updatePrecision.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.updateStartHour = this.updateStartHour.bind(this);
    this.updateEndHour = this.updateEndHour.bind(this);
    // this.updateScheme = this.updateScheme.bind(this);
  }
  handleLoadClick() {
    // 按api格式拼接日期
    let startTime =
      this.state.startDate.replace(/-/g, "/") + "Z" + this.state.startHour;
    let endTime =
      this.state.endDate.replace(/-/g, "/") + "Z" + this.state.endHour;
    // load data
    this.props.onSelect(
      this.state.dataType,
      this.state.dataMode,
      startTime,
      endTime
    );
  }
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
    this.props.onChangeHeatmapType(false);
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
    this.props.onChangeHeatmapType(checked);
  };

  handleClientChange = () => {};

  updateScheme = (e) => {
    // this.setState(e.target.value);
    console.log(e.target.value);
  };

  onChange(value, dateString) {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  }

  onOk(value) {
    console.log("onOk: ", value);
  }

  render() {
    const { clientOptions } = this;
    const {
      lngFrom = null,
      lngTo = null,
      latFrom = null,
      latTo = null,
    } = this.props.bbox;

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
              // onChange={handleChange}
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
            <div>Client selection:</div>
            <div id="checkbox-all">
              <Checkbox
                // indeterminate={true}
                onChange={null}
                checked={true}
              >
                Check all
              </Checkbox>
            </div>
            <CheckboxGroup
              // options={plainOptions}
              value={allValues} // 这里的value需要使用state来获取更新
              onChange={null}
              style={{ marginTop: "-15px" }}
            >
              <Row className="notLast">
                <Col span={6}>
                  <Checkbox value="client1">Client 1</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="client2">Client 2</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="client3">Client 3</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="client4">Client 4</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="client5">Client 5</Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Checkbox value="client6">Client 6</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="client7">Client 7</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="client8">Client 8</Checkbox>
                </Col>
              </Row>
            </CheckboxGroup>
          </div>
          <div className="control-panel__data__item_twoline">
            <div>Representation mode:</div>
            <Radio.Group value="query-based" onChange={this.updateScheme}>
              {/* TODO：此处的value需要使用state进行控制 */}
              <Radio.Button value="query-based">query-based</Radio.Button>
              <Radio.Button value="prediction-based">
                prediction-based
              </Radio.Button>
              <Radio.Button value="centralized">centralized</Radio.Button>
              <Radio.Button value="decentralized">decentralized</Radio.Button>
            </Radio.Group>
          </div>
          <div className="control-panel__data__item">
            <div>Partition granularity:</div>
            <Radio.Group value="coarse" onChange={this.updateScheme}>
              {/* TODO：此处的value需要使用state进行控制 */}
              <Radio.Button value="coarse">coarse</Radio.Button>
              <Radio.Button value="medium">medium</Radio.Button>
              <Radio.Button value="fine">fine</Radio.Button>
            </Radio.Group>
          </div>

          <div className="control-panel__data__item">
            <div>Expected precision:</div>
            <Radio.Group value="low" onChange={this.updateScheme}>
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
            <span className="dimensions dimensions_notchecked">orderID</span>
            <span className="dimensions">time</span>
            <span className="dimensions">latitude</span>
            <span className="dimensions">longitude</span>
          </div>

          <div className="control-panel__data__item_twoline">
            <div>Filters:</div>
            <div className="control-panel__data__item">
              <div>time:</div>
              {/* <Space direction="vertical" size={12}> */}
              <RangePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                onChange={this.onChange}
                onOk={this.onOk}
              />
              {/* </Space> */}
            </div>
            <div className="control-panel__data__item">
              <div>latitude:</div>
              {/* //TODO */}
              <span className="area_range">[20.011, 20.015]</span>
              <Slider range defaultValue={[20, 50]} />
            </div>
            <div className="control-panel__data__item">
              <div>longitude:</div>
              {/* //TODO */}
              <span className="area_range">[110.287,110.291]</span>
              <Slider range defaultValue={[20, 50]} />
            </div>
          </div>
          <div className="control-panel__data__item_twoline">
            <div>Visual forms:</div>
            <button className="visualForm">
              <img src={heatmap} alt="heatmap" />
            </button>
            <button className="visualForm">
              <img src={barchart} alt="barchart" />
            </button>
            <button className="visualForm">
              <img src={linechart} alt="linechart" />
            </button>
            <button className="visualForm">
              <img src={rada} alt="rada" />
            </button>
            <button className="visualForm">
              <img src={sankey} alt="sankey" />
            </button>
            <button className="visualForm">
              <img src={pie} alt="pie" />
            </button>
            <button className="visualForm">
              <img src={treemap} alt="treemap" />
            </button>
            <button className="visualForm">
              <img src={bubble} alt="bubble" />
            </button>
            <button className="visualForm">
              <img src={violin} alt="violin" />
            </button>
          </div>
          <div className="control-panel__data__item">
            <button className="load-btn" onClick={this.handleLoadClick}>
              Generate Visualization
            </button>
          </div>
        </div>
      </div>
    );
  }
}
