import React from 'react';
import logo from './logo.svg';
import './App.css';
import BMap from 'BMap';
import BMapLib from 'BMapLib'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import { haikouProcessDataToPoints, twoDimProcessDataToPoints } from './format-tool'
const useStyles = makeStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
});


class App extends React.Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
    this.state = {
      heatmap: {},
      dataName: 'predict/fed2c5l32u',
      max: 5000,
      name1: 'source/part1-des-s',
      name2: 'source/part1-starting-s'
    }
  }
  setPoint = data => {
    this.state.heatmap.setDataSet({ data: haikouProcessDataToPoints(data), max: this.state.max })
  }

  componentDidMount() {
    var map = new BMap.Map('map');
    // 创建地图实例  
    var point = new BMap.Point(110, 20);
    map.centerAndZoom(point, 10);             // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom(); // 允许滚轮缩放
    var heatmapOverlay = new BMapLib.HeatmapOverlay({ "radius": 30 });
    map.addOverlay(heatmapOverlay);
    // fetch('/naive-data.json').then(res => res.json()).then(data => {
    //   heatmapOverlay.setDataSet({data:processDataToPoints(data),max:20000})
    // })
    this.setState({
      heatmap: heatmapOverlay
    })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };


  handleClick = () => {
    fetch(this.state.dataName + '.json').then(res => res.json()).then(data => {
      this.setPoint(data)
    })
  }

  handleDiffClick = () => {
    fetch(this.state.name1 + '.json').then(res => res.json()).then(data1 => {
      fetch(this.state.name2 + '.json').then(res => res.json()).then(data2 => {
        let miss = 0
        for(let i = 0; i < data1.length; i++){
          for(let j = 0; j < data1[0].length; j++){
            let abs = Math.abs(data1[i][j] - data2[i][j])
            data1[i][j] = abs
            miss += abs
          }
        }
        console.log('miss is ' + miss)
        this.setPoint(data1)
      })
    })
  }

  render() {
    return (
      <div className="App">
        <div className="Map" ref={this.map} id={'map'} style={{ height: '100%', width: '100%', position: 'absolute' }} />
        <Paper style={{ 'position': 'absolute', marginLeft: '10px' }}>
          <InputBase
            placeholder="data"
            inputProps={{ 'aria-label': 'input data name' }}
            value={this.state.dataName}
            onChange={this.handleChange('dataName')}
          />
          <InputBase
            placeholder="heat map max"
            inputProps={{ 'aria-label': 'input data name' }}
            value={this.state.max}
            onChange={this.handleChange('max')}
          />
          <IconButton aria-label="Search" onClick={this.handleClick}>
            <SearchIcon />
          </IconButton>
        </Paper>

        <Paper style={{ 'position': 'absolute', marginLeft: '10px',marginTop: '60px' }}>
          <InputBase
            placeholder="data1"
            inputProps={{ 'aria-label': 'input data name' }}
            value={this.state.name1}
            onChange={this.handleChange('name1')}
          />
          <InputBase
            placeholder="data2"
            inputProps={{ 'aria-label': 'input data name' }}
            value={this.state.name2}
            onChange={this.handleChange('name2')}
          />
          <IconButton aria-label="Search" onClick={this.handleDiffClick}>
            diff<SearchIcon />
          </IconButton>
        </Paper>
      
      </div>
    )
  }
}



export default App;
