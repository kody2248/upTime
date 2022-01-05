import { MemoryRouter as Router, Link, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snap from 'snapsvg-cjs';

import '../assets/css/deviceSingle.scss';

import { exit } from 'process';
import ReactLogo from '../assets/img/DeviceListActive.svg';

class DeviceSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domLoaded: false,
    };

    this.activeToLine = this.activeToLine.bind(this);
    this.lineToActive = this.lineToActive.bind(this);
    this.limitActive = this.limitActive.bind(this);
    this.activate = this.activate.bind(this);
  }

  componentDidMount() {
    let { id } = this.props;
    id = `item-${id}`;

    this.device = document.getElementsByClassName(`device-item ${id}`);
    this.device = this.device[0];

    this.line = Snap.select(`.device-item.${id} .svg-line`);
    this.finish = Snap.select('.svg-active');

    this.linePoints = this.line.node.getAttribute('d');
    this.finishPoints = this.finish.node.getAttribute('d');

    this.setState({ domLoaded: true });
  }

  limitActive(type) {
    let val = false;
    let devices;
    const loaded = this.state.domLoaded;

    switch (type) {
      case 'isActive':
        val = loaded && this.device.classList.contains('active');
        break;
      case 'notActive':
        val = loaded && !this.device.classList.contains('active');
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
  }

  activeToLine() {
    if (this.limitActive('notActive')) {
      this.line.animate({ d: this.linePoints }, 300, mina.backout, () => {});
    }
  }

  lineToActive() {
    if (this.limitActive('notActive')) {
      this.line.animate({ d: this.finishPoints }, 300, mina.backout, () => {});
    }
  }

  activate() {
    let currentItem;
    const item = this.device;
    const { id, callback, icon, name, ip, port } = this.props;
    const idClass = `item-${id}`;
    if (this.limitActive('othersActive')) {
      const devices = document.querySelectorAll('.device-item');
      devices.forEach((device) => {
        device.classList.remove('active');
        if (device.classList[1] !== idClass) {
          currentItem = Snap.select(
            `.${device.classList[0]}.${device.classList[1]} .svg-line`
          );
          currentItem.animate(
            { d: this.linePoints },
            300,
            mina.easein,
            () => {}
          );
        }
      });
    }
    if (item.classList.contains('active')) {
      item.classList.remove('active');
      this.activeToLine();
    } else {
      item.classList.add('active');
      this.lineToActive();
    }

    callback({ id, icon, name, ip, port });
  }

  render() {
    const device = this.props;
    const id = `item-${device.id}`;
    return (
      <div
        className="device-item-wrap"
        onMouseEnter={this.lineToActive}
        onMouseLeave={this.activeToLine}
        onClick={this.activate}
        onKeyDown={this.activate}
        role="link"
        tabIndex={0}
      >
        <div className={`device-item ${id}`}>
          <div className="device-icon">
            <img src={device.icon} alt="" />
          </div>
          <p className="device-name">{device.name}</p>
          <p className="device-address">{device.ip}</p>
          <div className="device-active">
            {/* <img src={ActiveIcon} /> */}
            <ReactLogo className="active-svg" />
          </div>
        </div>
      </div>
    );
  }
}

// ES Lint requires defining propTypes to ensure understanding
DeviceSingle.propTypes = {
  id: PropTypes.number,
  key: PropTypes.number,
  icon: PropTypes.string,
  name: PropTypes.string,
  ip: PropTypes.string,
  port: PropTypes.string,
  callback: PropTypes.func,
};

// Default options for props
DeviceSingle.defaultProps = {
  id: 1,
  key: 1,
  icon: '',
  name: '',
  ip: '',
  port: '',
  callback: () => {},
};

export default withRouter(DeviceSingle);
