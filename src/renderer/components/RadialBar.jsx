import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';
import { createSvgIcon } from '@mui/material';

import '../assets/css/RadialBar.scss';

/**
 *
 * @param {Object} props Expects initial percent to display and text to use as a label
 * @returns
 */
const RadialBar = (props) => {
  const { id, percent, label, size } = props;

  /**
   *
   * @param {object} options Defines SVG element, circumference of circle, stroke width and percentage to animate.
   */
  const createCircle = (options) => {
    const {
      element,
      circleSize,
      stroke,
      percentage,
      label: labelOpt,
    } = options;
    const width = element.attr('width');
    const height = element.attr('height');

    element
      .append('circle')
      .attr('class', 'progress-background')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', circleSize)
      .attr('stroke', '#666')
      .attr('fill', 'none')
      .attr('stroke-width', stroke);

    element
      .append('circle')
      .attr('class', 'progress')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', circleSize)
      .attr('fill', 'none')
      .attr('stroke-width', stroke)
      .attr('stroke-linecap', 'round')
      .style('stroke-dashoffset', 2 * Math.PI * circleSize)
      .style('stroke-dasharray', 2 * Math.PI * circleSize);

    element
      .append('text')
      .attr('class', 'percentage')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .text(`${percentage * 100}%`);

    element
      .append('text')
      .attr('class', 'label')
      .attr('x', width / 2)
      .attr('y', height / 2 + 24)
      .attr('text-anchor', 'middle')
      .text(labelOpt);
  };

  const update = (options, delay = 0) => {
    const { element, circleSize, percentage } = options;
    const circumference = 2 * Math.PI * circleSize;
    const offset = circumference * (1 - percentage);

    setTimeout(() => {
      element
        .selectAll('.progress')
        .style('stroke-dashoffset', offset)
        .style('stroke-dasharray', circumference);
    }, delay);
  };

  useEffect(() => {
    console.log('radial render');
    const svg = d3.select('.radial-graph');
    const options = {
      element: svg,
      circleSize: size * 0.33,
      stroke: 10,
      percentage: percent,
      label,
    };
    createCircle(options);
    update(options, 250);
    return () => {
      svg.selectAll('*').remove();
    };
  }, [id, label, percent, size]);

  return <svg className="radial-graph" height={size} width={size * 0.75} />;
};

RadialBar.propTypes = {
  id: PropTypes.number,
  percent: PropTypes.number,
  label: PropTypes.string,
  size: PropTypes.string,
};
RadialBar.defaultProps = {
  id: 1,
  percent: 0,
  label: 'Uptime',
  size: '300',
};

export default RadialBar;
