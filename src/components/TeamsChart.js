import React from 'react'
import Chart from './Chart';
import { getTeamsPTSDataForChart, getTeamPTSDataForChart } from '../util';

const TeamsChart = ({ list, year, record }) => {
  const PTSdata = record === 'all' ? getTeamsPTSDataForChart(list) : getTeamPTSDataForChart(list);
  const text = record === 'all' ? 'all teams' : 'team';

  return (
    <div>
      <h3>Statistics of {text} in {year}</h3>
      <Chart data={PTSdata} indexAxis='x' datalabelsAlign='top' />
    </div>
  )
}

export default TeamsChart;
