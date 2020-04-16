import React from 'react';
import { get } from '../../api/tools';

export const galleryWithData = url => WrappedComponent => (
  class HoC extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        data: {}
      }
    }

    componentDidMount() {
      get({
        url
      }).then(resp => {
        this.setState({
          data: resp.data
        })
      }).catch(err => {
        
      });
    }

    render() {
      return (
        <WrappedComponent
          data={this.state.data}
        />
      );
    }
  }
);