import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import DeviceList from './DeviceList';
import DeviceContent from './DeviceContent';

import '../assets/css/devices.scss';

const Devices = (props) => {
  const [devices, setDevices] = useState([]);
  const [activeDevice, setActiveDevice] = useState({});
  const [activeId, setActiveId] = useState(1);
  const [selected, setSelected] = useState(false)

  const activate = (device) => {
    console.log('activate callback ran');
    setActiveDevice(device);
    setSelected(true);
  };

  // Update active device state with new values from form
  const formChange = (type, value) => {
    setActiveDevice((prevState) => ({
      ...prevState,
      name: type === 'name' ? value : prevState.name,
      ip: type === 'ip' ? value : prevState.ip,
      port: type === 'port' ? value : prevState.port,
      icon: type === 'icon' ? value : prevState.icon,
    }));
  };

  const getDevices = () => {
    // Listen for reply from main and set states
    window.electron.ipcRenderer.once('fetchDevices', (arg) => {
      setDevices(arg);
      setActiveDevice(arg[1]);
      setActiveId(arg[0].id);
    });
    // Call to main to fetch device list from data
    window.electron.ipcRenderer.send('fetchDevices', '');
  };

  //Placeholder to display before a device is selected
  const ContentPlaceholder = () => {
    console.log('placeholder');
    return (
      <div className="device-content-placeholder">
        <h3>Select a device to review statistics & edit details</h3>
      </div>
    );
  };

  const submitDeviceEdits = () => {
    // Listen for reply from main and set states
    window.electron.ipcRenderer.on('updateDeviceWidget', (arg) => {
      console.log(arg);
    });
    // Call to main to fetch device list from data
    window.electron.ipcRenderer.send('updateDeviceWidget', activeDevice);
  }

  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {}, [devices, activeDevice, activeId]);

  return (
    <div className="row">
      <div className="col-3">
        <DeviceList callback={activate} devices={devices} activeId={activeId} />
      </div>
      <div className="col-9">
        {!selected && <ContentPlaceholder />}
        {selected && (
          <DeviceContent
            device={activeDevice}
            inputCallback={formChange}
            submitCallback={submitDeviceEdits}
          />
        )}
      </div>
    </div>
  );
};

// Devices.propTypes = {

// }

export default Devices;
