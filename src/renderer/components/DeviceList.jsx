import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeviceSingle from './DeviceSingle';
import '../assets/css/DeviceList.scss';

  const DeviceList = (props) => {
  const { callback, devices } = props;

  useEffect(() => {
    console.log(devices);
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
            callback={() => {
              callback(server);
            }}
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

DeviceList.propTypes = {
  callback: PropTypes.func,
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      key: PropTypes.number,
      name: PropTypes.string,
      ip: PropTypes.string,
      port: PropTypes.string,
      icon: PropTypes.shape({
        name: PropTypes.string,
        path: PropTypes.string,
        size: PropTypes.string,
        type: PropTypes.string,
      }),
    })
  ),
};

DeviceList.defaultProps = {
  callback: () => {},
  devices:
    [{
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
    }],
};

export default DeviceList;
