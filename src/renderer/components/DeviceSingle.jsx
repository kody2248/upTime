import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../assets/css/deviceSingle.scss';

import activeIcon from '../assets/img/deviceListActive.png';
// import ReactLogo from '../assets/img/DeviceListActive.svg';

const DeviceSingle = (props) => {
  // Pull in props
  const { id, icon, name, ip, port, callback } = props;
  // Current list item DOM
  const itemDom = useRef();

  const limitActive = (type) => {
    let val = false;
    let devices;

    switch (type) {
      case 'isActive':
        val = itemDom.current.classList.contains('active');
        break;
      case 'notActive':
        val = !itemDom.current.classList.contains('active');
        break;
      case 'othersActive':
        devices = document.querySelectorAll('.device-item');
        devices.forEach((device) => {
          if (device.classList.contains('active')) {
            val = true;
          }
        });
        break;
      default:
        val = true;
        break;
    }
    return val;
  };

  const activate = () => {
    if (limitActive('othersActive')) {
      const allItems = document.querySelectorAll('.device-item');
      allItems.forEach((item) => {
        item.classList.remove('active');
      });
    }

    itemDom.current.classList.toggle('active');

    callback({ id, icon, name, ip, port });
  };

  useEffect(() => {
    itemDom.current = document.getElementsByClassName(`device-item item-${id}`);
    [itemDom.current] = itemDom.current;
    // Parse SVG for animation points
    // arrow.current = Snap.select(`.device-item.item-${id} .svg-line`);
    // finish.current = Snap.select('.svg-active');
    // startPoints.current = arrow.current.node.getAttribute('d');
    // finishPoints.current = finish.current.node.getAttribute('d');
  }, [id]);

  return (
    <div
      className="device-item-wrap"
      // onMouseEnter={startToFinish}
      // onMouseLeave={finishToStart}
      onClick={() => {
        activate(id);
      }}
      onKeyDown={() => {
        activate(id);
      }}
      role="link"
      tabIndex={0}
    >
      <div className={`device-item item-${id}`}>
        <div className="device-icon">
          <img src={icon.path} alt="" />
        </div>
        <p className="device-name">{name}</p>
        <p className="device-address">{ip}</p>
        <div className="device-active">
          {/* <img src={ActiveIcon} /> */}
          <img
            className="device-active-icon"
            alt="active-icon"
            src={activeIcon}
          />
        </div>
      </div>
    </div>
  );
};
DeviceSingle.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  ip: PropTypes.string,
  port: PropTypes.string,
  icon: PropTypes.shape({
    name: PropTypes.string,
    path: PropTypes.string,
    size: PropTypes.string,
    type: PropTypes.string,
  }),
  callback: PropTypes.func,
};

DeviceSingle.defaultProps = {
  id: 1,
  icon: {
    name: '',
    path: '',
    size: '0 mb',
    type: '',
  },
  name: '',
  ip: '',
  port: '',
  callback: () => {},
};

export default DeviceSingle;
