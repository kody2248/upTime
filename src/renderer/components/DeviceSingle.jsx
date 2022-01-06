import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Snap from 'snapsvg-cjs';
import '../assets/css/deviceSingle.scss';
import { exit } from 'process';

// import ReactLogo from '../assets/img/DeviceListActive.svg';

const DeviceSingle = (props) => {
  // Store status of DOM loading to avoid parse errors
  const [domLoaded, setDomLoaded] = useState(false);
  // Pull in props
  const { id, icon, name, ip, port, callback, activeId } = props;
  // Current list item DOM
  const itemDom = useRef();
  // Parse SVG for animation points
  const arrow = useRef();
  const finish = useRef();
  const startPoints = useRef();
  const finishPoints = useRef();

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

  const startToFinish = () => {
    if (limitActive('notActive')) {
      arrow.current.animate(
        { d: finishPoints.current },
        300,
        mina.backout,
        () => {}
      );
    }
  };

  const finishToStart = () => {
    if (limitActive('notActive')) {
      arrow.current.animate(
        { d: startPoints.current },
        300,
        mina.backout,
        () => {}
      );
    }
  };

  const activate = (activeId) => {
    let currentItem;

    if (limitActive('othersActive')) {
      const allItems = document.querySelectorAll('.device-item');
      allItems.forEach((item) => {
        item.classList.remove('active');
        if (item.classList[1] !== `item-${activeId}`) {
          currentItem = Snap.select(
            `.${item.classList[0]}.${item.classList[1]} .svg-line`
          );
          currentItem.animate(
            { d: startPoints.current },
            300,
            mina.easein,
            () => {}
          );
        }
      });
    }
    if (itemDom.current.classList.contains('active')) {
      itemDom.current.classList.remove('active');
      finishToStart();
    } else {
      itemDom.current.classList.add('active');
      startToFinish();
    }
    callback({ id, icon, name, ip, port });
  };

  useEffect(() => {
    itemDom.current = document.getElementsByClassName(`device-item item-${id}`);
    [itemDom.current] = itemDom.current;
    console.log(itemDom.current);
    // Parse SVG for animation points
    // arrow.current = Snap.select(`.device-item.item-${id} .svg-line`);
    // finish.current = Snap.select('.svg-active');
    // startPoints.current = arrow.current.node.getAttribute('d');
    // finishPoints.current = finish.current.node.getAttribute('d');
  }, []);

  return (
    <div
      className="device-item-wrap"
      onMouseEnter={startToFinish}
      onMouseLeave={finishToStart}
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
          <img src={icon} alt="" />
        </div>
        <p className="device-name">{name}</p>
        <p className="device-address">{ip}</p>
        <div className="device-active">
          {/* <img src={ActiveIcon} /> */}
        </div>
      </div>
    </div>
  );
};

DeviceSingle.propTypes = {};

export default DeviceSingle;
