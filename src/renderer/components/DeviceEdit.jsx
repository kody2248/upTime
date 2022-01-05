import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ImageIcon from '@mui/icons-material/Image';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import '../assets/css/DeviceEdit.scss';

const DeviceEdit = (props) => {
  const { device, callback } = props;
  const { name, ip, port, icon } = device;

  const [nameState, setName] = useState('');
  const [ipState, setIp] = useState('');
  const [portState, setPort] = useState('');
  const [iconState, setIcon] = useState('');

  const [iconUpload, setIconUpload] = useState('');
  const [iconUploadStatus, seticonUploadStatus] = useState(false)

  const toggleImage = () => {
    let image = document.getElementsByClassName('device-icon-display');
    [image] = image;

    if (image.classList.contains('d-none')) {
      image.classList.remove('d-none');
      setTimeout(() => {
        image.style.opacity = 1;
      }, 150);
    } else {
      image.style.opacity = 0;
      setTimeout(() => {
        image.classList.add('d-none');
        toggleUpload();
      }, 250);
    }
  };

  const toggleUpload = () => {
    let input = document.getElementsByClassName('device-icon-upload');
    [input] = input;

    if (input.classList.contains('d-none')) {
      input.classList.remove('d-none');
      setTimeout(() => {
        input.style.opacity = 1;
      }, 150);
    } else {
      input.style.opacity = 0;
      setTimeout(() => {
        input.classList.add('d-none');
        toggleImage();
      }, 250);
    }
  };

  const handleUpload = (e) => {
    const {
      lastModified,
      lastModifiedDate,
      name: imgName,
      path,
      size,
      type,
    } = e.target.files[0];
    setIcon({
      name: imgName,
      path: `file:\\\\${path}`,
      size,
      type,
    });

    console.log(iconState.path);

    // Listen for reply from main and set states
    window.electron.ipcRenderer.on('imageHandler', (arg) => {
      console.log(arg);
      console.log('render image handler');
      seticonUploadStatus(true);
    });
    // Call to main to fetch device list from data
    window.electron.ipcRenderer.send('imageHandler', { path, name: nameState, type });
  };

  // Fire when new object is passed
  useEffect(() => {
    console.log(device);
    setName(name);
    setIp(ip);
    setPort(port);
    setIcon(icon);
  }, [device]);

  return (
    <div className="device-form">
      <div className="device-form-header">
        <SettingsOutlinedIcon /> Settings
      </div>
      <div className="row">
        <div className="col-md-12">
          <label htmlFor="device-input-name" className="col-form-label">
            Device:
          </label>
          <input
            id="device-input-name"
            type="text"
            className="form-control"
            value={nameState}
            onChange={(e) => {
              callback('name', e.target.value);
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <label htmlFor="device-input-address" className="col-form-label">
            Address:
          </label>
          <input
            id="device-input-name"
            type="text"
            className="form-control"
            value={ipState}
            onChange={(e) => {
              callback('ip', e.target.value);
            }}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="device-input-port" className="col-form-label">
            Port:
          </label>
          <input
            id="device-input-name"
            type="text"
            className="form-control"
            value={portState}
            onChange={(e) => {
              callback('port', e.target.value);
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          {/* Display Icon if exists */}
          <div
            className={
              iconState === ''
                ? 'device-icon-display d-none'
                : 'device-icon-display'
            }
          >
            <div className="device-icon-details">
              <div className="row no-gutters">
                <div className="device-icon-image">
                  <img src={iconState.path} alt="icon" />
                </div>

                <div className="col-md-6">
                  <p className="device-icon-file">{iconState.name}</p>
                  <p className="device-icon-size">{iconState.size}</p>
                </div>
                <div className="col-md-3">
                  <div
                    className={
                      iconUploadStatus
                        ? 'device-icon-controls'
                        : 'd-none device-icon-controls'
                    }
                    role="button"
                    tabIndex="0"
                    onClick={toggleImage}
                    onKeyPress={toggleImage}
                  >
                    <DeleteForeverIcon />
                  </div>
                  <div className={
                      !iconUploadStatus
                        ? 'device-input-loader'
                        : 'd-none device-input-loader'
                    }></div>
                </div>
              </div>
            </div>
          </div>
          {/* Display upload if doesn't exist */}
          <div
            className={
              iconState === ''
                ? 'device-icon-upload'
                : 'device-icon-upload d-none'
            }
          >
            <label
              htmlFor="device-input-icon"
              className="col-form-label input-icon-label"
              onClick={() => {
                toggleUpload();
              }}
            >
              <ImageIcon />
              <p>Upload Icon</p>
            </label>
            <input
              className="form-control"
              id="device-input-icon"
              type="file"
              onChange={(e) => {
                handleUpload(e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

DeviceEdit.propTypes = {
  callback: PropTypes.func,
  device: PropTypes.shape({
    id: PropTypes.number,
    key: PropTypes.number,
    name: PropTypes.string,
    ip: PropTypes.string,
    port: PropTypes.string,
    icon: PropTypes.string,
  }),
};

DeviceEdit.defaultProps = {
  callback: () => {
    console.log('default cb');
  },
  device: {
    id: 1,
    key: 1,
    icon: '',
    name: '',
    ip: '',
  },
};

export default DeviceEdit;
