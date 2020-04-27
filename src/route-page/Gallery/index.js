import React from 'react';
import {withRouter} from "react-router-dom";
import GalleryProgress from "./progress";
import * as d3 from "d3";
import './index.less';

const timeScale = d3.scaleLinear()
  .domain([10, 1280])
  .range([3, 20])

const pages = [
  {
    url: "/treemap",
    name: "Treemap",
    partition: 220,
    threshold: 1,
  },
  {
    url: "/linechart",
    name: "Line chart",
    partition: 100,
    threshold: 2,
  },
  {
    url: "/sankey",
    name: "Sankey",
    partition: 68,
    threshold: 3,
  },
  {
    url: "/barchart",
    name: "Barchart",
    partition: 26,
    threshold: 4,
  },
  {
    url: "/ridgeline",
    name: "Ridgeline",
    partition: 144,
    threshold: 5,
  },
  {
    url: "/violin",
    name: "Violin chart",
    partition: 150,
    threshold: 6,
  },
  {
    url: "/radar",
    name: "Radar graph",
    partition: 6,
    threshold: 7,
  },
  {
    url: "/lollipop",
    name: "Lollipop",
    partition: 26,
    threshold: 8,
  },
  {
    url: "/circularbar",
    name: "Circular bar",
    partition: 26,
    threshold: 9,
  },
  {
    url: "/pie",
    name: "Pie chart",
    partition: 10,
    threshold: 11,
  },
  {
    url: "/circlepacking",
    name: "Circle packing",
    partition: 220,
    threshold: 12,
  },
  {
    url: "/area",
    name: "Area chart",
    partition: 1280,
    threshold: 10,
  },
  {
    url: "/sunburst",
    name: "Sunburst",
    partition: 220,
    threshold: 13,
  },
  {
    url: "/icicle",
    name: "Icicle",
    partition: 220,
    threshold: 14,
  }
];

pages.forEach(page => page.threshold = timeScale(page.partition));

const initialState = {};
pages.forEach(page => initialState[page.name] = false);

class Gallery extends React.Component {
  constructor(props) {
    super(props);

    this.interval = 100;

    this.pages = pages;

    this.state = {...initialState};
  }

  handleClick = (url) => {
    this.props.history.push(url);
  }

  handleTimeout = (name) => {
    this.setState({
      [name]: true,
    });
  }

  render() {
    const { pages, interval } = this;
    return (
      <div className="gallery">
        <header className="gallery__title">Federated Visualization of Charts</header>
        <main className="gallery__content">
        {
          pages.map((page) => (
            <div className="gallery__content__wrapper"
              key={page.name}
            >
              <div className="gallery__content__title">
                {page.name}
                <GalleryProgress
                  name={page.name}
                  interval={interval}
                  threshold={page.threshold}
                  onTimeout={this.handleTimeout}
                />
              </div>
              <div className="gallery__content__graph"
                onClick={() => {this.handleClick(page.url)}}
              >
                <iframe className="gallery__content_item"
                  src={page.url}
                />
                <div className="gallery__content__mask"
                  style={{
                    opacity: this.state[page.name] ? 0 : 1
                  }}
                />
              </div>
              <div className="gallery__content__info">
                <div># Clients: 8</div>
                <div># Partitions: {page.partition}</div>
                <div># Records: 8000000</div>
              </div>
            </div>
          ))
        }
        </main>
      </div>
    );
  }
}

export default withRouter(Gallery);
