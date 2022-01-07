import { useEffect, useState } from 'react';

import DeviceList from './DeviceList';
import DeviceContent from './DeviceContent';

import '../assets/css/devices.scss';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [activeDevice, setActiveDevice] = useState({});
  const [activeId, setActiveId] = useState(1);
  const [selected, setSelected] = useState(false);

  // Device selection callback
  const activate = (device) => {
    console.log(device);
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

  // Read datastore to get list of devices
  const getDevices = () => {
    console.log('get devices ran');
    // Listen for reply from main and set states
    window.electron.ipcRenderer.once('fetchDevices', (arg) => {
      setDevices(arg);
      // Set initial device if first load
      if (activeDevice.length === 0) {
        setActiveDevice(arg[1]);
        setActiveId(arg[0].id);
      };
    });
    // Call to main to fetch device list from data
    window.electron.ipcRenderer.send('fetchDevices', '');
  };

  // Placeholder to display before a device is selected
  const ContentPlaceholder = () => {
    return (
      <div className="device-content-placeholder">
        <h3>Select a device to review statistics & edit details</h3>
      </div>
    );
  };

  const submitDeviceEdits = (device) => {
    const newData = {
      ...device,
      name: document.getElementById('device-input-name').value,
      ip: document.getElementById('device-input-address').value,
      port: document.getElementById('device-input-port').value,
    };

    // Listen for reply from main and set states
    window.electron.ipcRenderer.on('updateDeviceWidget', (arg) => {
      // refresh devices on return
      getDevices();
    });
    // Call to main to fetch device list from data
    window.electron.ipcRenderer.send('updateDeviceWidget', newData);
  };

  useEffect(() => {
    getDevices();
    console.log(devices);
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

export default Devices;
