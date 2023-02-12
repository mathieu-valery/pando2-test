import './App.css';
import axios from "axios"
import { useState, useEffect } from "react"
import LineChart from './components/LineChart';
import Select from 'react-select'

const url = "http://localhost:3000/api/v1/measurements"

const TYPES = [
  'CO2',
  'HUM',
  'TMP',
  'VOCT'
]

const ROOMS = [
  'Room B2',
  'Room 8A',
  'Room 8F',
]

async function getMeasurements() {
  return await axios.get(url)
}

function App() {
  const [measurements, setMeasurements] = useState(null)
  const [chartsData, setChartsData] = useState(null)
    // Expected state for chartsData:
    // [
    // {
    // measure_type: 'CO2',
    // chartData:
    //   {
    //     labels: [],
    //     datasets: [
    //       {
    //       label: "",
    //       data: []
    //       }
    //     ]
    //   }
    // }
    // ]

  const [types, setTypes] = useState([])
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    getMeasurements().then(response => setMeasurements(response.data))
  }, [])

  useEffect(() => {
    if (measurements) {
      const newChartsData = types.map(type => {
        const filteredData = filterMeasurements(type)

        const chartData = {
          labels: filteredData[0].measurements.map((el) => el.timestamp),
          datasets: filteredData.map(obj => {
            return {
                    label: obj.room_name,
                    data: obj.measurements.map((el) => el.measure_float)
                    }
          })
        }
        return {
          measure_type: type,
          chartData: chartData
        }
      })
      setChartsData(newChartsData)
    }
  }, [rooms, types])

  function filterMeasurements(type) {
    const filteredMeasurements = measurements.filter(measurement => rooms.includes(measurement.room_name) && measurement.measure_type === type)

    const groupedMeasurements = filteredMeasurements.reduce((acc,currentMeasurement) => {
      const findedTypeIndex = acc.findIndex(
        (obj) => obj.room_name === currentMeasurement.room_name
      )
      if (findedTypeIndex > -1) {
        acc[findedTypeIndex].measurements.push(currentMeasurement);
      } else {
        acc.push({ room_name: currentMeasurement.room_name, measurements: [currentMeasurement] })
      }
      return acc
    }, [])
    return groupedMeasurements;
  }

  function handleChange(selectedOptions, name) {
    const newState = selectedOptions.map((option) =>option.value)
    if (newState.length === 0) return
    if (name === 'rooms') setRooms(newState)
    if (name === 'types') setTypes(newState)
  }

  return (
    <div className="App">
      <div className='filters-container'>
        <div className='select-container'>
          <label htmlFor="room-select">Filter rooms:</label>
          <Select
            options={ROOMS.map((type) => ({value: type, label: type}))}
            isMulti
            name='rooms-select'
            onChange={(selectedOptions) => handleChange(selectedOptions, 'rooms')}
        />
        </div>
        <div className='select-container'>
          <label htmlFor="type-select">filter parameters:</label>
          <Select
            options={TYPES.map((type) => ({value: type, label: type}))}
            isMulti
            name='type-select'
            onChange={(selectedOptions) => handleChange(selectedOptions, 'types')}
        />
        </div>
      </div>
      {
        chartsData &&
          chartsData.map(obj => (
            <LineChart
              key={obj.measure_type}
              chartData={obj.chartData}
              title={obj.measure_type}>
            </LineChart>
          ))
      }
    </div>
  );
}

export default App;
