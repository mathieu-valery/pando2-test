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

  const [measureTypes, setMeasureTypes] = useState([])
  const [roomNames, setRoomNames] = useState([])

  useEffect(() => {
    getMeasurements().then(response => setMeasurements(response.data))
  }, [])

  useEffect(() => {
    if (measurements) {
      const newChartsData = measureTypes.map(measureType => {
        const filteredData = filterMeasurements(measureType)

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
          measure_type: measureType,
          chartData: chartData
        }
      })
      setChartsData(newChartsData)
    }
  }, [roomNames, measureTypes])

  function filterMeasurements(measureType) {
    const filteredMeasurements = measurements.filter(measurement => roomNames.includes(measurement.room_name) && measurement.measure_type === measureType)

    const groupedMeasurementsByRoomName = filteredMeasurements.reduce((acc,currentMeasurement) => {
      const findedRoomNameIndex = acc.findIndex(
        (obj) => obj.room_name === currentMeasurement.room_name
      )
      if (findedRoomNameIndex > -1) {
        acc[findedRoomNameIndex].measurements.push(currentMeasurement);
      } else {
        acc.push({ room_name: currentMeasurement.room_name, measurements: [currentMeasurement] })
      }
      return acc
    }, [])
    return groupedMeasurementsByRoomName;
  }

  function handleChange(selectedOptions, name) {
    const newState = selectedOptions.map((option) => option.value)
    if (newState.length === 0) return
    if (name === 'roomNames') setRoomNames(newState)
    if (name === 'measureTypes') setMeasureTypes(newState)
  }

  return (
    <div className="App">
      <div className='filters-container'>
        <div className='select-container'>
          <label htmlFor="room-select">Filter roomNames:</label>
          <Select
            options={ROOMS.map((type) => ({value: type, label: type}))}
            isMulti
            name='roomNames-select'
            onChange={(selectedOptions) => handleChange(selectedOptions, 'roomNames')}
        />
        </div>
        <div className='select-container'>
          <label htmlFor="type-select">filter parameters:</label>
          <Select
            options={TYPES.map((type) => ({value: type, label: type}))}
            isMulti
            name='type-select'
            onChange={(selectedOptions) => handleChange(selectedOptions, 'measureTypes')}
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
