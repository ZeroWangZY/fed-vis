import React from "react";
import "./index.less";
// import clsx from 'clsx';
// import Paper from '@material-ui/core/Paper';
// import InputBase from '@material-ui/core/InputBase';
// import IconButton from '@material-ui/core/IconButton';
// import SearchIcon from '@material-ui/icons/Search';
// import MenuIcon from '@material-ui/icons/Menu';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import { Drawer, Divider } from '@material-ui/core';
// import { withStyles } from '@material-ui/styles';

// import MapPanel from './component/map/MapPanel';
import ControlPanelContainer from "../../container/ControlPanelContainer";
import MapPanelContainer from "../../container/MapPanelContainer";
import DetailPanelContainer from "../../container/DetailPanelContainer";
import ClientPanelContainer from "../../container/ClientPanelContainer";
import DataOverviewPanel from "../../component/dataoverviewPanel/DataOverviewPanel";
import ModelView from "../../component/modelView/ModelView";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataName: "",
      heatData: [],
      isDrawerOpen: true,
    };

    // this.handleClick = this.handleClick.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }

  // handleClick() {
  //     fetch(this.state.dataName + '.json')
  //         .then(res => res.json())
  //         .then(data =>
  //             this.setState({
  //                 heatData: processDataToPoints(data),
  //                 dataName: ''
  //             })
  //         );
  // }

  handleDrawerOpen() {
    this.setState({
      isDrawerOpen: true,
    });
  }

  handleDrawerClose() {
    this.setState({
      isDrawerOpen: false,
    });
  }

  render() {
    let { heatData } = this.state;
    let { isDrawerOpen } = this.state;
    // const { classes } = this.props;

    // const $input = (
    //     <>
    //         <InputBase
    //             placeholder="input data name"
    //             style={{ padding: '10px 20px' }}
    //             inputProps={{ 'aria-label': 'input data name' }}
    //             value={dataName}
    //             onChange={e => this.setState({ dataName: e.target.value })}
    //         />
    //         <IconButton aria-label="Search" onClick={this.handleClick}>
    //             <SearchIcon />
    //         </IconButton>
    //     </>
    // );
    return (
      <div className="App">
        {/* <div id="left-panel">
          <ControlPanelContainer />
          <DataOverviewPanel />
        </div>
        <div id="map-panel">
          <MapPanelContainer heatData={heatData} isDrawerOpen={isDrawerOpen} />
          <DetailPanelContainer />
        </div>
        <ModelView /> */}
        <div id="config-panel">
          <ControlPanelContainer />
        </div>
        <div id="server-panel">
          <MapPanelContainer heatData={heatData} isDrawerOpen={isDrawerOpen} />
          <ModelView />
        </div>
        <div id="client-panel">
          <ClientPanelContainer />
        </div>
      </div>
    );
  }
}

export default App;
// export default withStyles(styles)(App);
