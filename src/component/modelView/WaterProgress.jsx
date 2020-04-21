import React from 'react';
import * as d3 from "d3";

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
    this.range = .2 // 浪幅
    this.nowrange = this.range;
    this.xoffset = 8 * this.lineWidth; // x 轴偏移量
    this.data = ~~(this.props.value) / 100;   // 数据量
    this.sp = 0; // 周期偏移量
    this.nowdata = 1;
    this.waveupsp = 0.009; // 水波上涨速度
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

    this.yOffset = []
    for (var i = this.xoffset; i <= this.xoffset + this.axisLength; i += 5120 / this.axisLength) {
      var x = this.sp + (this.xoffset + i) / this.unit;
      var y = this.Sin(x)
      this.yOffset.push(y)
    }
    this.draw()

  }

  drawSine() {
    const ctx = this.ctx
    const xoffset = this.xoffset
    ctx.beginPath();
    ctx.save();
    var Stack = []; // 记录起始点和终点坐标
    let counter = 0
    for (let i = xoffset; i <= xoffset + this.axisLength; i += 5120 / this.axisLength) {
      var x = this.sp + (xoffset + i) / this.unit;
      var y = this.yOffset[counter] * this.nowrange;
      var dx = i;
      var dy = 2 * this.cR * (1 - this.nowdata) + (this.r - this.cR) - (this.unit * y);
      ctx.lineTo(dx, dy);
      Stack.push([dx, dy])
      counter++
    }
    // 获取初始点和结束点
    var startP = Stack[0]
    var endP = Stack[Stack.length - 1]
    ctx.lineTo(xoffset + this.axisLength, this.oW);
    ctx.lineTo(xoffset, this.oW);
    ctx.lineTo(startP[0], startP[1])
    ctx.fillStyle = "#8cb1cf";
    ctx.fill();
    ctx.restore();
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
    this.ctx.lineWidth = 8;
    this.ctx.strokeStyle = '#8cb1cf';
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
    let { ctx, range, waveupsp } = self
    let firstDraw = true
    function anim() {
      if (Math.abs(self.props.value - self.nowdata) < 0.009 && !firstDraw) {
        // console.log("return " + self.props.name)
        return
      }
      firstDraw = false

      ctx.clearRect(0, 0, self.oW, self.oH);
      //最外面淡黄色圈
      self.drawCircle();

      //裁剪中间水圈  
      self.clipCircle();

      if (self.props.value >= 0.85) {
        if (self.nowrange > range / 4) {
          var t = range * 0.01;
          self.nowrange -= t;
        }
      } else if (self.props.value <= 0.1) {
        if (self.nowrange < range * 1.5) {
          var t = range * 0.01;
          self.nowrange += t;
        }
      } else {
        if (self.nowrange <= range) {
          var t = range * 0.01;
          self.nowrange += t;
        }
        if (self.nowrange >= range) {
          var t = range * 0.01;
          self.nowrange -= t;
        }
      }
      if ((self.props.value - self.nowdata) > 0) {
        self.nowdata += waveupsp;
      }
      if ((self.props.value - self.nowdata) < 0) {
        self.nowdata -= waveupsp
      }
      // self.sp += 0.7;
      // 开始水波动画

      self.drawSine();

      // 写字
      // this.drawText();
    }
    setInterval(anim, 30)

  }

  // componentWillReceiveProps(nextProps) {
  //   this.draw(nextProps.value)
  // }

  render() {
    // const { percent, losses } = this.props;
    // const numClient = losses.length;

    return (<div style={{ display: "inline-block" }}>
      <canvas className="water_progress" style={{ width: 60, height: 60, margin: "0 12px" }} ref={this.canvas}>当前浏览器不支持canvas 请升级！</canvas>
      <div>{this.props.name}</div>
    </div >
    );
  }
}

export default WaterProgress;
