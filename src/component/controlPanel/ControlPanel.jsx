import React from "react";
import "./ControlPanel.less";
import { Select, Radio, Button } from "antd";
import { Divider } from "antd";
import { Checkbox, Row, Col } from "antd";
import "antd/lib/switch/style/index.css";
// import "../chart/mod/node_modules/antd/lib/select/style/index.css";
import VisualForms from "./mod/VisualForms";
import DimensionAndFilterUrban from "./mod/DimensionAndFilterUrban";
import DimensionAndFilterCancer from "./mod/DimensionAndFilterCancer";
import DimensionAndFilterMovie from "./mod/DimensionAndFilterMovie";
import DimensionIcon from "./mod/DimensionIcon";
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const precisionRoundMap = {
  low: 60,
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
      dataMode: "fitting",
      precision: "high",
      enableError: false,
      checkedError: false,
      partition: "coarse",
      currentClient: [],
      filters: {},
      visualForm: "heatmap",
      visualFormDimension: "two_dimension_map",
    };

    this.clientOptions = ["3", "4", "5", "6", "7", "8"];

    this.generateVisualization = this.generateVisualization.bind(this);
    this.updateDatamode = this.updateDatamode.bind(this);
    this.updatePrecision = this.updatePrecision.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.updateStartHour = this.updateStartHour.bind(this);
    this.updateEndHour = this.updateEndHour.bind(this);
    this.handleDatasetChange = this.handleDatasetChange.bind(this);
    // // this.updateOrderState = this.updateOrderState.bind(this);
    // this.updateScheme = this.updateScheme.bind(this);
  }
  generateVisualization() {
    // load data
    this.props.onGenerate({
      dataset: this.state.dataset,
      // filter↓
      ...this.state.filters,
      visualForm: this.state.visualForm,
      visualFormDimension: this.state.visualFormDimension,
      dataMode: this.state.dataMode,
      partition: this.state.partition,
      currentClient: this.state.currentClient,
    });
  }

  updateVisualForm = ({ type, dimension }) => {
    this.setState({
      visualForm: type,
      visualFormDimension: dimension,
    });
  };

  updateDatamode(e) {
    this.setState({
      dataMode: e.target.value,
      enableError: e.target.value === "fitting",
      checkedError: false,
    });
    this.props.onToggleChartError(false);
  }

  updateFilters = (nextFilters) => {
    this.setState({ filters: nextFilters });
  };
  updatePrecision(e) {
    this.setState({
      precision: e.target.value,
    });

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
    this.setState({
      dataset: value,
    });
  };

  updateCurrentClient = (checkedList) => {
    // const { clientList } = this.state;
    this.setState({
      currentClient: checkedList,
    });
  };

  handleClientChange = () => { };

  updateScheme = (e) => {
    // this.setState(e.target.value);
    console.log(e.target.value);
  };

  // updateOrderState = (e) => {
  //   this.setState({ dataType: e.target.value });
  // };

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
              <Option value="The United States Cancer Statistics dataset">
                The United States Cancer Statistics dataset
              </Option>
              <Option value="The MovieLens dataset">
                The MovieLens dataset
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
              Federated: <Radio.Button value="normal">query-based</Radio.Button>
              <Radio.Button value="fitting">prediction-based</Radio.Button>
              <br />Traditional: <Radio.Button value="centralized">centralized</Radio.Button>
              <Radio.Button value="decentralized">decentralized</Radio.Button>
            </Radio.Group>
          </div>

          {dataMode === "fitting" ? (
            <>
              <div className="control-panel__data__item">
                <div>Expected precision:</div>
                <Radio.Group value={precision} onChange={this.updatePrecision}>
                  <Radio.Button value="low">low</Radio.Button>
                  <Radio.Button value="medium">medium</Radio.Button>
                  <Radio.Button value="high">high</Radio.Button>
                </Radio.Group>
              </div>

              <div className="control-panel__data__item_twoline">
                <div>Training parameter:</div>
                <span className="trainingParam">learning rate: 0.055</span>
                <span className="trainingParam">batch size: 12800</span>
                <span className="trainingParam">round: 300</span>
                <span className="trainingParam">epoch: 1</span>
              </div>
            </>
          ) : null}

          <Divider
            style={{ fontSize: "18px", fontWeight: "bold", margin: "10px 0" }}
          >
            Query configuration
          </Divider>

          {/* TODO: 等下再传值，处理 onCHange */}
          {
            {
              "Urban-Mobility dataset": (
                <DimensionAndFilterUrban onChange={this.updateFilters} />
              ),
              "The United States Cancer Statistics dataset": (
                <DimensionAndFilterCancer onChange={this.updateFilters} />
              ),
              "The MovieLens dataset": (
                <DimensionAndFilterMovie onChange={this.updateFilters} />
              ),
            }[dataset]
          }

          <div className="control-panel__data__item_twoline">
            <VisualForms
              value={this.state.visualForm}
              onSelect={this.updateVisualForm}
            />
          </div>

          <div className="control-panel__data__item">
            <div>Partition granularity:</div>
            <DimensionIcon dimension={this.state.visualFormDimension} />
            <Radio.Group value={partition} onChange={this.updatePartition}>
              <Radio.Button value="coarse">coarse</Radio.Button>
              <Radio.Button value="medium">medium</Radio.Button>
              <Radio.Button value="fine">fine</Radio.Button>
            </Radio.Group>
          </div>

          <div className="control-panel__data__item">
            <Button
              className="load-btn"
              onClick={this.generateVisualization}
              disabled={!this.state.dataset}
              loading={this.props.chartDataLoading}
            >
              Generate Visualization
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
