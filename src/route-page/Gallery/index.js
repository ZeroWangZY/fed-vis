import React from 'react';
import {withRouter} from "react-router-dom";
import './index.less';

class Gallery extends React.Component {
  constructor(props) {
    super(props);

    this.pages = [
      {
        url: "/treemap"
      },
      {
        url: "/linechart"
      },
      {
        url: "/sankey"
      },
      {
        url: "/barchart"
      },
      {
        url: "/ridgeline"
      },
      {
        url: "/violin"
      },
      {
        url: "/radar"
      },
      {
        url: "/lollipop"
      },
      {
        url: "/circularbar"
      }
    ];
  }

  handleClick = (url) => {
    this.props.history.push(url);
  }

  render() {
    const { pages } = this;
    return (
      <div className="gallery">
        <header className="gallery__title">Gallery</header>
        <main className="gallery__content">
        {
          pages.map((page, i) => (
            <div className="gallery__content__wrapper"
              key={i}
              onClick={() => {this.handleClick(page.url)}}
            >
              <iframe className="gallery__content_item"
                src={page.url}
              />
              <div className="gallery__content__mask" />
            </div>
          ))
        }
        </main>
      </div>
    );
  }
}

export default withRouter(Gallery);
