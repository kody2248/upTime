import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeviceList from './deviceList_orig';
import DeviceContent from './DeviceContent';
import '../assets/css/devices.scss';

export default class Devices extends Component {
  constructor(props) {
    super(props);
    const test = 'test';
    this.state = { devices: {}, activeDevice: {} };
    this.activeDevice = this.activeDevice.bind(this);
  }

  componentWillUnmount(){
    this.getDevices();
  }

  getDevices() {
    window.electron.ipcRenderer.once('fetchDevices', (arg) => {
      this.setState({ devices: arg });
    });

    window.electron.ipcRenderer.send('fetchDevices', '');
  }

  activeDevice(device) {
    this.setState({ activeDevice: device });
    console.log(device);
    console.log('callback from devices component')
    //console.log(this.state.device);
  }


  render() {
    const { devices } = this.state;
    return (
      <div className="row">
        <div className="col-3">
          <DeviceList callback={this.activeDevice} devices={devices} />
        </div>
        <div className="col-9">
          <DeviceContent device={activeDevice} />
        </div>
      </div>
    );
  }
}

// ES Lint requires defining propTypes to ensure understanding
Devices.propTypes = {
  test: PropTypes.string,
};

// Default options for props
Devices.defaultProps = {
  test: 'yadayada',
};
