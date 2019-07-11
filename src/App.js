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
function processDataToPoints(data) {

  let points=[]
  data.forEach((item1,i) => {
    item1.forEach((item2, j) => {
      if(item2 !== 0){
        points.push({
          lng: j - 180,
          lat: i - 90,
          count: item2
        })
      }
    })
  })
  return points
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
    this.state = {
      heatmap: {},
      dataName: ''
    }
  }
  setPoint = data => {
    this.state.heatmap.setDataSet({data: processDataToPoints(data), max: 10000})
  }

  componentDidMount() {
    var map = new BMap.Map('map');
    // 创建地图实例  
    var point = new BMap.Point(-96, 39.921984);
    map.centerAndZoom(point, 5);             // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom(); // 允许滚轮缩放
    var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":30});
    map.addOverlay(heatmapOverlay);
    // fetch('/naive-data.json').then(res => res.json()).then(data => {
    //   heatmapOverlay.setDataSet({data:processDataToPoints(data),max:20000})
    // })
    this.setState({
      heatmap: heatmapOverlay 
    })
  }

  handleChange = e => {
    this.setState({
      dataName: e.target.value
    })
  }
  handleClick = () => {
    fetch(this.state.dataName + '.json').then(res => res.json()).then(data => {
      this.setPoint(data)
    })
  }

  render() {
    return (
    <div className="App">
      <div className ="Map" ref={this.map} id={'map'} style={{height: '100%', width:'100%', position: 'absolute'}}/>
      <Paper style={{'position': 'absolute', marginLeft:'10px'}}>
      <InputBase
        placeholder="input data name"
        inputProps={{ 'aria-label': 'input data name' }}
        value={this.state.dataName}
        onChange={this.handleChange}
      />
      <IconButton aria-label="Search" onClick={this.handleClick}>
        <SearchIcon />
      </IconButton>
    </Paper>
    </div>
    )
  }
}



export default App;
