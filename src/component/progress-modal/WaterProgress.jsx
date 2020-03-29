import React from 'react';
import * as d3 from "d3";

import "./index.less";

class WaterProgress extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidMount() {
    let canvas = this.canvas.current
    this.ctx = canvas.getContext("2d");
    this.M = Math;
    this.Sin = this.M.sin;
    this.Cos = this.M.cos;
    this.Sqrt = this.M.sqrt;
    this.Pow = this.M.pow;
    this.PI = this.M.PI;
    this.Round = this.M.round;
    this.oW = canvas.width = 250;
    this.oH = canvas.height = 250;
    // 线宽
    this.lineWidth = 2;
    // 大半径
    this.r = (this.oW / 2);
    this.cR = this.r - 10 * this.lineWidth;
    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth;
    // 水波动画初始参数
    this.axisLength = 2 * this.r - 16 * this.lineWidth;  // Sin 图形长度
    this.unit = this.axisLength / 9; // 波浪宽
    this.range = .6 // 浪幅
    this.nowrange = this.range;
    this.xoffset = 8 * this.lineWidth; // x 轴偏移量
    this.data = ~~(this.props.value) / 100;   // 数据量
    this.sp = 0; // 周期偏移量
    this.nowdata = 1;
    this.waveupsp = 0.06; // 水波上涨速度
    // 圆动画初始参数
    this.arcStack = [];  // 圆栈
    this.bR = this.r - 8 * this.lineWidth;
    this.soffset = -(this.PI / 2); // 圆动画起始位置
    this.circleLock = true; // 起始动画锁
    // 获取圆动画轨迹点集
    for (var i = this.soffset; i < this.soffset + 2 * this.PI; i += 1 / (8 * this.PI)) {
      this.arcStack.push([
        this.r + this.bR * this.Cos(i),
        this.r + this.bR * this.Sin(i)
      ])
    }
    // 圆起始点
    this.cStartPoint = this.arcStack.shift();
    this.ctx.strokeStyle = "#1c86d1";
    this.ctx.moveTo(this.cStartPoint[0], this.cStartPoint[1]);

    this.draw()

    //灰色圆圈
    // function grayCircle() {
    //   ctx.beginPath();
    //   ctx.lineWidth = 10;
    //   ctx.strokeStyle = '#eaeaea';
    //   ctx.arc(r, r, cR - 5, 0, 2 * Math.PI);
    //   ctx.stroke();
    //   ctx.restore();
    //   ctx.beginPath();
    // }
    // //橘黄色进度圈
    // function orangeCircle() {
    //   ctx.beginPath();
    //   ctx.strokeStyle = '#fbdb32';
    //   //使用这个使圆环两端是圆弧形状
    //   ctx.lineCap = 'round';
    //   ctx.arc(r, r, cR - 5, 0 * (Math.PI / 180.0) - (Math.PI / 2), (nowdata * 360) * (Math.PI / 180.0) - (Math.PI / 2));
    //   ctx.stroke();
    //   ctx.save()
    // }


    //渲染canvas


  }

  drawSine() {
    this.ctx.beginPath();
    this.ctx.save();
    var Stack = []; // 记录起始点和终点坐标
    for (var i = this.xoffset; i <= this.xoffset + this.axisLength; i += 20 / this.axisLength) {
      var x = this.sp + (this.xoffset + i) / this.unit;
      var y = this.Sin(x) * this.nowrange;
      var dx = i;
      var dy = 2 * this.cR * (1 - this.nowdata) + (this.r - this.cR) - (this.unit * y);
      this.ctx.lineTo(dx, dy);
      Stack.push([dx, dy])
    }
    // 获取初始点和结束点
    var startP = Stack[0]
    var endP = Stack[Stack.length - 1]
    this.ctx.lineTo(this.xoffset + this.axisLength, this.oW);
    this.ctx.lineTo(this.xoffset, this.oW);
    this.ctx.lineTo(startP[0], startP[1])
    this.ctx.fillStyle = "#fbec99";
    this.ctx.fill();
    this.ctx.restore();
  }

  drawText() {
    this.ctx.globalCompositeOperation = 'source-over';
    var size = 0.4 * this.cR;
    this.ctx.font = 'bold ' + size + 'px Microsoft Yahei';
    let txt = (this.nowdata.toFixed(2) * 100).toFixed(0) + '%';
    var fonty = this.r + size / 2;
    var fontx = this.r - size * 0.8;
    this.ctx.fillStyle = "#f6b71e";
    this.ctx.textAlign = 'center';
    this.ctx.fillText(txt, this.r + 5, this.r + 20)
  }

  //最外面淡黄色圈
  drawCircle() {
    this.ctx.beginPath();
    this.ctx.lineWidth = 15;
    this.ctx.strokeStyle = '#fff89d';
    this.ctx.arc(this.r, this.r, this.cR + 7, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.restore();
  }
  //裁剪中间水圈
  clipCircle() {
    this.ctx.beginPath();
    this.ctx.arc(this.r, this.r, this.cR - 10, 0, 2 * Math.PI, false);
    this.ctx.clip();
  }

  draw() {
    const self = this
    function anim() {
      self.ctx.clearRect(0, 0, self.oW, self.oH);
      //最外面淡黄色圈
      self.drawCircle();
      //灰色圆圈  
      // grayCircle();
      //橘黄色进度圈
      // orangeCircle();
      //裁剪中间水圈  
      self.clipCircle();
      if (self.props.value >= 0.85) {
        if (self.nowrange > self.range / 4) {
          var t = self.range * 0.01;
          self.nowrange -= t;
        }
      } else if (self.props.value <= 0.1) {
        if (self.nowrange < self.range * 1.5) {
          var t = self.range * 0.01;
          self.nowrange += t;
        }
      } else {
        if (self.nowrange <= self.range) {
          var t = self.range * 0.01;
          self.nowrange += t;
        }
        if (self.nowrange >= self.range) {
          var t = self.range * 0.01;
          self.nowrange -= t;
        }
      }
      if ((self.props.value - self.nowdata) > 0) {
        self.nowdata += self.waveupsp;
      }
      if ((self.props.value - self.nowdata) < 0) {
        self.nowdata -= self.waveupsp
      }
      self.sp += 0.7;
      // 开始水波动画
      self.drawSine();
      // 写字
      // this.drawText();


      // if (Math.abs(self.props.value - self.nowdata) < 0.01) {
      //   cancelAnimationFrame(self.frameId)
      // } else {
      // self.frameId = requestAnimationFrame(anim)
      // }
    }
    setInterval(anim, 200)

  }

  // componentWillReceiveProps(nextProps) {
  //   this.draw(nextProps.value)
  // }

  render() {
    // const { percent, losses } = this.props;
    // const numClient = losses.length;

    return (<div style={{ display: "inline-block" }}>
      <canvas className="water_progress" style={{ width: 100, height: 100, margin: "0 12px" }} ref={this.canvas}>当前浏览器不支持canvas 请升级！</canvas>
      <div>{this.props.name}</div>
    </div >
    );
  }
}

export default WaterProgress;
