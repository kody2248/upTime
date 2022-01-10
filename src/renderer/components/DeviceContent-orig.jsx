import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DeviceEdit from './DeviceEdit';
import RadialBar from './RadialBar';

import '../assets/css/deviceContent.scss';

export default class DeviceContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {}

  render() {
    const { device, inputCallback, submitCallback, imageDeleteCallback } = this.props;
    return (
      <div className="device-content">
        <div className="row">
          <div className="col-7">
            <DeviceEdit
              device={device}
              inputCallback={inputCallback}
              submitCallback={submitCallback}
              imageDeleteCallback={imageDeleteCallback}
            />
          </div>
          <div className="col-5">
            <RadialBar percent={0.33} label="Uptime" size="250" />
          </div>
        </div>
      </div>
    );
  }
}

// ES Lint requires defining propTypes to ensure understanding
DeviceContent.propTypes = {
  inputCallback: PropTypes.func,
  submitCallback: PropTypes.func,
  imageDeleteCallback: PropTypes.func,
  device: PropTypes.shape({
    id: PropTypes.number,
    key: PropTypes.number,
    icon: PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string,
      size: PropTypes.string,
      type: PropTypes.string,
    }),
    name: PropTypes.string,
    ip: PropTypes.string,
  }),
};

// Default options for props
DeviceContent.defaultProps = {
  inputCallback: () => {},
  submitCallback: () => {},
  imageDeleteCallback: () => {},
  device: {
    id: 1,
    key: 1,
    icon: {
      name: '',
      path: '',
      size: '0 mb',
      type: '',
    },
    name: '',
    ip: '',
  },
};
