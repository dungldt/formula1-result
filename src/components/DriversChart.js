import React from 'react'
import Chart from './Chart';
import { getDriversPTSDataForChart, getDriverPTSDataForChart } from '../util';

const DriversChart = ({ list, year, record }) => {
  const PTSdata = record === 'all' ? getDriversPTSDataForChart(list) : getDriverPTSDataForChart(list);
  const text = record === 'all' ? 'all drivers' : 'driver';

  return (
    <div>
      <h3>Statistics of {text} in {year}</h3>
      <Chart data={PTSdata} />
    </div>
  )
}

export default DriversChart;
