import './App.css';
import axios from "axios"
import { useState, useEffect } from "react"
import LineChart from './components/LineChart';

const url = "http://localhost:3000/api/v1/measurements"

const TYPES = [
  'CO2',
  'HUM',
  'TMP',
  'VOCT'
]

async function getMeasurements() {
  return await axios.get(url)
}

function App() {
  const [measurements, setMeasurements] = useState(null)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: "",
      data: []
    }]
  })
  const [types, setTypes] = useState(['CO2'])

  useEffect(() => {
    getMeasurements().then(response => setMeasurements(response.data))
  }, [])

  useEffect(() => {
    if (measurements) {
      const filteredData = filterMeasurements()
      setChartData({
        labels: filteredData[0].measurements.map((el) => el.timestamp),
        datasets: filteredData.map(obj => {
          return {
                  label: obj.type,
                  data: obj.measurements.map((el) => el.measure_float)
                  }
        })
      })
    }
  }, [measurements, types])

  function filterMeasurements() {
    const filteredMeasurements = measurements.filter(measurement => types.includes(measurement.measure_type) && measurement.room_id === 1)

    const groupedMeasurements = filteredMeasurements.reduce((acc,currentMeasurement) => {
      const findedTypeIndex = acc.findIndex(
        (obj) => obj.type === currentMeasurement.measure_type
      )
      if (findedTypeIndex > -1) {
        acc[findedTypeIndex].measurements.push(currentMeasurement);
      } else {
        acc.push({ type: currentMeasurement.measure_type, measurements: [currentMeasurement] })
      }
      return acc
    }, [])
    return groupedMeasurements;
  }

  function handleClick(e) {
    if (types.includes(e.target.value)) {
      const prevState = types
      const nextState = prevState.filter(type => type !== e.target.value)
      if (nextState.length > 0) {
        setTypes(nextState)
      }
    } else {
      setTypes([...types, e.target.value])
    }
  }

  return (
    <div className="App">
      <select
        onClick={(e) => handleClick(e)}
        name='type'
        id='type-select'
      >
      {TYPES.map((type, index) =>
        <option
          key={index}
          value={type}>
          {type}
        </option>)}
      </select>
      {
        <LineChart chartData={chartData}></LineChart>
      }
    </div>
  );
}

export default App;
