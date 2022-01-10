/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ImageIcon from '@mui/icons-material/Image';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import '../assets/css/DeviceEdit.scss';

const DeviceEdit = (props) => {
  const {
    device,
    inputCallback,
    submitCallback,
    imageDeleteCallback,
    imageUploadCallback,
  } = props;

  const [nameState, setName] = useState('');
  const [ipState, setIp] = useState('');
  const [portState, setPort] = useState('');
  const [iconState, setIcon] = useState('');

  // Hide or show image display if icon is present
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
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        toggleUpload();
      }, 250);
    }
  };

  // Hide or show image display if icon is present
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

  // Format bytes to readable string
  const getReadableFileSizeString = (fileSizeInBytes) => {
    let i = -1;
    const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
      fileSizeInBytes /= 1024;
      i += 1;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  };

  // Image input onChange
  const imageUpload = (e) => {
    const { path, size, type } = e.target.files[0];
    imageUploadCallback(path, getReadableFileSizeString(size), type);
  };

  const imageDelete = () => {
    toggleImage();
    imageDeleteCallback();
  };

  // Fire when new object is passed
  useEffect(() => {
    const upload = document.getElementById('device-icon-upload');
    const display = document.getElementById('device-icon-display');
    // Call via property vs upperscope declaration to avoid eslint errors
    setName(device.name);
    setIp(device.ip);
    setPort(device.port);
    setIcon(device.icon);

    upload.style.opacity = 1;
    display.style.opacity = 1;
  }, [
    device.name,
    device.ip,
    device.port,
    device.icon,
    nameState,
    ipState,
    portState,
    iconState,
  ]);

  return (
    <div className="device-form">
      <div className="device-form-header">
        <SettingsOutlinedIcon /> Settings
      </div>
      <div className="row">
        <div className="col-md-12">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="device-input-name" className="col-form-label">
            Device:
          </label>
          <input
            id="device-input-name"
            type="text"
            className="form-control"
            value={nameState}
            onChange={(e) => {
              inputCallback('name', e.target.value);
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="device-input-address" className="col-form-label">
            Address:
          </label>
          <input
            id="device-input-address"
            type="text"
            className="form-control"
            value={ipState}
            onChange={(e) => {
              inputCallback('ip', e.target.value);
            }}
          />
        </div>
        <div className="col-md-4">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="device-input-port" className="col-form-label">
            Port:
          </label>
          <input
            id="device-input-port"
            type="text"
            className="form-control"
            value={portState}
            onChange={(e) => {
              inputCallback('port', e.target.value);
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          {/* Display Icon if exists */}
          <div
            id="device-icon-display"
            className={
              device.icon.name === ''
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
                    className="device-icon-controls"
                    role="button"
                    tabIndex="0"
                    onClick={imageDelete}
                    onKeyPress={imageDelete}
                  >
                    <DeleteForeverIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Display upload if doesn't exist */}
          <div
            id="device-icon-upload"
            className={
              device.icon.name === ''
                ? 'device-icon-upload'
                : 'device-icon-upload d-none'
            }
          >
            <label
              htmlFor="device-input-icon"
              className="col-form-label input-icon-label"
            >
              <ImageIcon />
              <p>Upload Icon</p>
            </label>
            <input
              className="form-control"
              id="device-input-icon"
              type="file"
              onChange={(e) => {
                imageUpload(e);
              }}
            />
          </div>
        </div>
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="btn"
          onClick={() => {
            submitCallback(device);
          }}
        >
          Update <ArrowForwardIcon />
        </button>
      </div>
    </div>
  );
};

DeviceEdit.propTypes = {
  inputCallback: PropTypes.func,
  submitCallback: PropTypes.func,
  imageDeleteCallback: PropTypes.func,
  imageUploadCallback: PropTypes.func,
  device: PropTypes.shape({
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
  }),
};

DeviceEdit.defaultProps = {
  inputCallback: () => {},
  submitCallback: () => {},
  imageDeleteCallback: () => {},
  imageUploadCallback: () => {},
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

export default DeviceEdit;
