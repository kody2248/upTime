import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import '../assets/css/deviceNotificationCounter.scss';

export default class DeviceNotificationCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { count } = this.props;
    return (
      <div className="device-notification-count">
        <NotificationsActiveIcon />
        <p>Notifications</p>
        <h2>{count}</h2>
      </div>
    );
  }
}

DeviceNotificationCounter.propTypes = {
  count: PropTypes.number,
};

// Default options for props
DeviceNotificationCounter.defaultProps = {
  count: 0,
};
