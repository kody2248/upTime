import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter as Router, NavLink, withRouter } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeviceSingle from './deviceSingle-orig';

// const { ipcRenderer } = window.require("electron");

import '../assets/css/deviceList.scss';
import { SevenMpRounded } from '@mui/icons-material';

export default class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: true,
      devices: [],
    };
  }

  defaultActive( item ) {
    const {callback,activeId} = this.props;
    const active = document.getElementsByClassName(`.device-item item-${activeId}`)
    active.classList.add('active');
    callback( item )
  }

  render() {
    // const servers = this.props;
    const { callback, devices } = this.props;

    return (
      <div className="device-list">
        <div className="nav-border" />
        <h5>Devices</h5>
        <ul>
          {devices.map((server) => (
            <DeviceSingle
              key={server.id}
              id={server.id}
              name={server.name}
              icon={server.icon}
              ip={server.ip}
              port={server.port}
              callback={this.defaultActive}
            />
          ))}
        </ul>
        <div className="device-add-link">
          <NavLink to="/devices/add">
            <AddCircleOutlineIcon />
            Add Device
          </NavLink>
        </div>
      </div>
    );
  }
}

// ES Lint requires defining propTypes to ensure understanding
DeviceList.propTypes = {
  callback: PropTypes.func,
  activeId: PropTypes.number,
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      key: PropTypes.number,
      name: PropTypes.string,
      ip: PropTypes.string,
      port: PropTypes.string,
      icon: PropTypes.string,
    }),
  ),
};

// Default options for props
DeviceList.defaultProps = {
  callback: () => {},
  activeId: 0,
  devices: {
    id: 1,
    key: 1,
    icon: '',
    name: '',
    ip: '',
  },
};
