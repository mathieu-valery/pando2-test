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
  const [chartsData, setChartsData] = useState([
    {
    measure_type: 'CO2',
    chartData:
      {
        labels: [],
        datasets: [
          {
          label: "",
          data: []
          }
        ]
      }
    }
    ])

  const [types, setTypes] = useState(['CO2'])
  const [rooms, setRooms] = useState(['Room B2'])

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
  }, [measurements, rooms, types])

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

  function handleClickRooms(e) {
    if (rooms.includes(e.target.value)) {
      const prevState = rooms
      const nextState = prevState.filter(room => room !== e.target.value)
      if (nextState.length > 0) {
        setRooms(nextState)
      }
    } else {
      setRooms([...rooms, e.target.value])
    }
  }

  function handleClickTypes(e) {
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
        onClick={(e) => handleClickRooms(e)}
        name='type'
        id='type-select'
      >
      {ROOMS.map((room, index) =>
        <option
          key={index}
          value={room}>
          {room}
        </option>)}
      </select>
      <select
        onClick={(e) => handleClickTypes(e)}
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
        chartsData && chartsData.map(obj => (
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
