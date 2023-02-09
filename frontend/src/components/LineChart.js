import React from "react";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';

function LineChart({ chartData, title }) {

    return (
    <>
      <h1>{title}</h1>
      <Line data={chartData}/>
    </>
    )
}

export default LineChart