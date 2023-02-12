import React from "react";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import './LineChart.css';

function LineChart({ chartData, title }) {

    return (
    <div className='chart-container'>
      <h1>{title}</h1>
      <Line data={chartData}/>
    </div>
    )
}

export default LineChart