import React from 'react'
import Chart from './Chart';
import { getDriversPTSDataForChart } from '../util';

const AllDriversChart = ({ list, year }) => {
  const dataPTS = getDriversPTSDataForChart(list);

  return (
    <div>
      <h3>Statistics of all drivers in {year}</h3>
      <Chart data={dataPTS} />
    </div>
  )
}

export default AllDriversChart;
