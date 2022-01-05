import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MemoryRouter as Router, NavLink, withRouter } from 'react-router-dom';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import logo from '../assets/img/logo.png';

import '../assets/css/nav.scss';

export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.links = [
      {
        title: 'Dashboard',
        icon: <DashboardCustomizeOutlinedIcon />,
        path: '/home',
      },
      {
        title: 'Devices',
        icon: <TvOutlinedIcon />,
        path: '/devices',
      },
    ];
  }

  render() {
    return (
      <div className="nav-content">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <ul>
          {this.links.map((link) => (
            <li key={link.title}>
              <NavLink to={link.path}>
                {link.icon}
                {link.title}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-settings">
          <NavLink to="/settings">
            <SettingsOutlinedIcon />
            Settings
          </NavLink>
        </div>
      </div>
    );
  }
}
