import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../assets/css/DeviceBarGraph.scss';

import * as d3 from 'd3';

const DeviceBarGraph = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (data.length === 0) {
      const res = window.electron.ipcRenderer.send('fetchDeviceData', '');
      window.electron.ipcRenderer.on('fetchDeviceData', (arg) => {
        console.log(arg);
        setData(arg);
      });
    } else {
      drawChart(calcSuccessFailures(data));
    }
  }, [data]);

  return <svg className="device-graph" height="200" width="300" />;
};
// DeviceBarGraph.propTypes = {
//   test: PropTypes.string,
// };

const calcSuccessFailures = (data) => {
  let success = 0;
  let failure = 0;

  console.log(success);
  data.map((log) => {
    console.log(log);
    if (log.result === 'success') {
      success += 1;
      return log;
    }
    failure += 1;
    return log;
  });
  console.log([success, failure]);
  return [success, failure];
};

const drawChart = (data) => {
  //data = [8,5,9,6,32,5,4,30,65,23];
  console.log(Math.ceil(Math.max(...data)) * 10);
  const svg = d3.select('.device-graph');
  const margin = 25;
  const width = svg.attr('width') - margin * 2;
  const height = svg.attr('height') - margin * 2;
  const xScale = d3.scaleBand().range([0, width]).padding(0.5);
  const yScale = d3.scaleLinear().range([height, 0]);
  xScale.domain(data);
  yScale.domain([0, Math.ceil(Math.max(...data) / 10) * 10]);
  // eslint-disable-next-line prettier/prettier
  svg.append('g')
    .attr('transform', `translate(${margin},${height + margin * 0.5})`)
    .attr('class', 'device-graph-text')
    .call(
      d3.axisBottom(xScale).tickFormat(function (d) {
        return d;
      })
    );

  svg
    .append('g')
    .attr('transform', `translate(${margin},${margin / 2})`)
    .attr('class', 'device-graph-text')
    .call(
      // eslint-disable-next-line prettier/prettier
    d3.axisLeft(yScale)
        .tickFormat((d) => {
          return `${d}`;
        })
        .ticks(3)
    );

  svg
    .append('g')
    .attr('class', 'index-line')
    .attr('transform', `translate(${width+margin},${margin / 2})`)
    .attr('width',width)
    .call(d3.axisLeft(yScale).ticks(3).tickSize(width).tickFormat(''));

  svg
    .selectAll('.bar-bg')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar-bg')
    .attr('transform', `translate(${margin + xScale.bandwidth()*.10},${margin * 0.5})`)
    .attr('rx', '10')
    // .attr('ry', '20')
    .attr('x', function (d,i) {
      console.log(i);
      return xScale(d);
    })
    .attr('width', xScale.bandwidth()*.75)
    .attr('y', function (d) {
      return 0;
    })
    .attr('height', function (d) {
      return height;
    });

  svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('transform', `translate(${margin + xScale.bandwidth()*.10},${margin * 0.5})`)
    .attr('rx', '10')
    // .attr('ry', '20')
    .attr('x', function (d) {
      return xScale(d);
    })
    .attr('width', xScale.bandwidth()*.75)
    .attr('y', function (d) {
      return yScale(d);
    })
    .attr('fill', (d,i) => console.log(i))
    .attr('height', function (d) {
      return height - yScale(d);
    });

};

export default DeviceBarGraph;
