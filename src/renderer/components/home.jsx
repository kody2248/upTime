import { MemoryRouter as Router, Link, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WatchList from './devices_orig';

import '../assets/css/home.scss';

class Home extends Component {
  constructor(props) {
    super(props);

    const params = this.props;

    this.state = {
      test: params.test,
    };
  }

  componentDidMount() {
    const { test } = this.state;
    console.log(test);
  }

  render() {
    console.log(this.props);

    return (
      <div>Home</div>
    );
  }
}

// ES Lint requires defining propTypes to ensure understanding
Home.propTypes = {
  test: PropTypes.string,
};

// Default options for props
Home.defaultProps = {
  test: 'yadayada',
};

// Wrap component in router if using links in react-router
export default Home;
