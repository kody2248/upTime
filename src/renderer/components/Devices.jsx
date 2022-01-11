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

  const imageDelete = () => {
    const newData = {
      ...activeDevice,
      icon: {
        name: '',
        path: '',
        size: '',
        type: '',
      },
    };
    // Call to main to fetch device list from data
    window.electron.ipcRenderer.send('imageDelete', {
      icon: activeDevice.icon,
      devices: addDeviceToMaster(newData),
    });
    // Listen for reply from main and set states
    window.electron.ipcRenderer.on('imageDelete', () => {});
  };

  // Image upload handler
  const imageUpload = (path, size, type) => {
    console.log('image upload');

    // Call to submit
    window.electron.ipcRenderer.send('imageHandler', {
      id: activeDevice.id,
      name: activeDevice.id,
      type,
      path,
    });

    // Listen for reply from main and set states
    window.electron.ipcRenderer.on('imageHandler', (arg) => {
      // Update device object to reflect icon changes
      const newData = {
        ...activeDevice,
        icon: {
          name: arg.fileName,
          path: arg.output,
          size,
          type: arg.type,
        },
      };

      setActiveDevice(newData);
      const newDevices = addDeviceToMaster(newData);
      console.log('New devices:');
      console.log(newDevices);
      console.log('active device');
      console.log(activeDevice);
      window.electron.ipcRenderer.send('updateDeviceJSON', newDevices);
    });
  };

  // Read datastore to get list of devices
  const getDevices = () => {
    // Listen for reply from main and set states
    window.electron.ipcRenderer.once('fetchDevices', (arg) => {
      console.log(arg);
      setDevices(arg.devices);
      // Set initial device if first load
      if (activeDevice.length === 0) {
        setActiveDevice(arg.devices[1]);
        setActiveId(arg.devices[0].id);
      }
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

  const submitDeviceEdits = (currentDevice) => {
    const newData = {
      ...currentDevice,
      name: document.getElementById('device-input-name').value,
      ip: document.getElementById('device-input-address').value,
      port: document.getElementById('device-input-port').value,
    };

    const newDevices = addDeviceToMaster(newData);
    console.log('New data being added to master list and JSON');
    console.log(newDevices);
    // Call to main to fetch device list from data
    window.electron.ipcRenderer.send('updateDeviceJSON', newDevices);

    // Listen for reply from main and set states
    window.electron.ipcRenderer.on('updateDeviceJSON', (arg) => {
      // refresh devices on return
      getDevices();
    });
  };

  useEffect(() => {
    getDevices();
    console.log('Devices master: Get Devices');
  }, []);

  // Update overall device state with new device object
  const addDeviceToMaster = (newData) => {
    const newDevices = devices.map((item) => {
      if (item.id === newData.id) {
        item = {
          id: item.id,
          name: newData.name !== item.name ? newData.name : item.name,
          ip: newData.ip !== item.ip ? newData.ip : item.ip,
          port: newData.port !== item.port ? newData.port : item.port,
          icon: {
            name:
              newData.icon.name !== item.icon.name
                ? newData.icon.name
                : item.icon.name,
            path:
              newData.icon.path !== item.icon.path
                ? newData.icon.path
                : item.icon.path,
            size:
              newData.icon.size !== item.icon.size
                ? newData.icon.size
                : item.icon.size,
            type:
              newData.icon.type !== item.icon.type
                ? newData.icon.type
                : item.icon.type,
          },
        };
      }
      return item;
    });

    setDevices(newDevices);
    console.log(devices);
    return newDevices;
  };

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
            imageDeleteCallback={imageDelete}
            imageUploadCallback={imageUpload}
          />
        )}
      </div>
    </div>
  );
};

export default Devices;
