import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter as Router, NavLink, withRouter } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Snap from 'snapsvg-cjs';
import DeviceSingle from './DeviceSingle';
import '../assets/css/DeviceList.scss';

const DeviceList = (props) => {
  const { callback, devices } = props;

  useEffect(() => {
    //
  });

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
            callback={()=>{callback(server)}}
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
};

DeviceList.propTypes = {};

export default DeviceList;
