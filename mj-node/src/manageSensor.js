import axios from 'axios'

const getSensorData = async () => {
  const refineData = (data) => {
    return JSON.parse(data.replace(/&quot;/g, '"'))
  }

  try {
    const { data } = await axios.get(`http://${process.env.SENSOR_IP}`)

    return refineData(data)
  } catch (error) {
    this.log(error)
    return 'Err'
  }
}

export { getSensorData }
