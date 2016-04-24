import { CALL_API, Schemas } from '../middleware/api'
import moment from 'moment'
import airport_codes from './airport_codes.json'

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'


const API_ROOT = 'https://flightstats-api.herokuapp.com/flex/flightstatus/rest/v2/json/'
const AUTH_STRING = '?appId=0f80d303&appKey=64a8a2b28e2b5efee4a869e447060268&utc=false'

const CORS_ANYWHERE = 'https://cors-anywhere.herokuapp.com/'


// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchUser(carrier, flight, year, month, day) {
  if (!year) {
    let now = moment()
    year = now.year()
    month = now.month() + 1
    day = now.date()
  }
  return {
    [CALL_API]: {
      types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
      endpoint: `${API_ROOT}flight/status/${carrier}/${flight}/dep/${year}/${month}/${day}${AUTH_STRING}`,
      schema: Schemas.FLIGHT,
    }
  }
}


export const WEATHER_REQUEST = 'WEATHER_REQUEST'
export const WEATHER_SUCCESS = 'WEATHER_SUCCESS'
export const WEATHER_FAILURE = 'WEATHER_FAILURE'



// Fetches a weather forecast for a day using the forecast.io API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchWeather(airport_data, unix_time) {
  var latitude = airport_data.latitude;
  var longitude = airport_data.longitude;
  var API_KEY = "8aaa1191e7da730e86d8a96f5032d132"
  return {
    [CALL_API]: {
      types: [ WEATHER_REQUEST, WEATHER_SUCCESS, WEATHER_FAILURE ],
      endpoint: `${CORS_ANYWHERE}https://api.forecast.io/forecast/${API_KEY}/${latitude},${longitude},${unix_time}`,
      schema: Schemas.WEATHER,
    }
  }
}

export function loadWeather(airport_code, time) {
  let unix_time = moment(time).unix()
  return (dispatch, getState) => {
    const airport_data = getState().entities.airports[airport_code]
    const long = airport_data.longitude;
    const lat = airport_data.latitude;
    const weather = getState().entities.weathers[`${long},${lat}`]
    if (weather) return null
    
    
    return dispatch(fetchWeather(airport_data, unix_time))
  }
}

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadUser(flight, year, month, day = []) {
  return (dispatch, getState) => {
    const flight_details = getState().entities.flights[`${flight}/${year}/${month}/${day}`]
    if (flight_details) {
      return null
    }

    let regex = /([a-zA-Z]+)(\d+)/;
    let result = flight.match(regex);
    if(result) {
      let [dummy, airline, flight_num] = result;
      return dispatch(fetchUser(airline, flight_num,  year, month, day))
    }
  }
}


export const MACHINE_REQUEST = 'MACHINE_REQUEST'
export const MACHINE_SUCCESS = 'MACHINE_SUCCESS'
export const MACHINE_FAILURE = 'MACHINE_FAILURE'
export const CLEAR_MACHINE = 'CLEAR_MACHINE'

export function fetchMachine(time, arr_time, flight_stats, weather, destWeather) {

  time = moment(time);

  let depart_port = flight_stats.departureAirportFsCode;
  let arr_port = flight_stats.arrivalAirportFsCode;

  let depart_code = '0'
  let arrive_code = '0'
  if (depart_port in airport_codes) {
    depart_code = airport_codes[depart_port]
  }
  if (arr_port in airport_codes) {
    arrive_code = airport_codes[arr_port]
  }

  let depart_time = moment(flight_stats.departureDate.dateLocal).format('Hmm')
  let arrive_time = moment(flight_stats.arrivalDate.dateLocal).format('Hmm')
  let mph_knots = 0.868976;
  let data = {
        "DayofMonth": time.date(),
        "DayOfWeek": time.day(),
        "Carrier": flight_stats.carrierFsCode,
        // "OriginAirportID": depart_code,
        // "DestAirportID": arrive_code,
        "CRSDepTime": depart_time,
        "CRSArrTime": arrive_time,
        "ArrDel15": '0',
    // Departure?
        "Timezone": '0',
        "Visibility": weather.currently.visibility || "0",
        "DryBulbFarenheit": weather.currently.temperature,
        "DewPointFarenheit": weather.currently.dewPoint,
        "RelativeHumidity": weather.currently.humidity*100,
        "WindSpeed": weather.currently.windSpeed * mph_knots,
        "Altimeter": '0',
    // Destination??
        "Timezone (2)": '0',
        "Visibility (2)": destWeather.currently.visibility || "0",
        "DryBulbFarenheit (2)": destWeather.currently.temperature,
        "DewPointFarenheit (2)": destWeather.currently.dewPoint,
        "RelativeHumidity (2)": destWeather.currently.humidity*100,
        "WindSpeed (2)": destWeather.currently.windSpeed * mph_knots,
        "Altimeter (2)": '0'
  }

  let body = {
  "Inputs": {
    "input1": {
      "ColumnNames": [
      ],
      "Values": [
        [        ]
      ]
    }
  },
  "GlobalParameters": {}
}
  for (let key of Object.keys(data)) {
    body.Inputs.input1.ColumnNames.push(key)
    body.Inputs.input1.Values[0].push(`${data[key]}`)
  }

  return {
    [CALL_API]: {
      types: [ MACHINE_REQUEST, MACHINE_SUCCESS, MACHINE_FAILURE ],
      endpoint: `${CORS_ANYWHERE}https://asiasoutheast.services.azureml.net/workspaces/fd13a298d4c34a60917e0bdb8ddc63cd/services/298b8d5eb9e9445c8cec08a549eb608d/execute?api-version=2.0&details=true`,
      // endpoint: 'https://flyto.azure-api.net/flightdelay',
      schema: Schemas.MACHINE,
      method: 'POST',
      body: body,
      headers: {Authorization: 'Bearer /R5R26y2Jv7Y8nc4TeqlDKVm6MhvnvVMz2HCN8e8dusW+uLDDZmvyTPlKGOsX4m8joMhFvXf6QAm3hI3DethMA==',
      'Content-Type': 'application/json',
      'Accept': 'application/json'}
    }
  }
}

export function clearMachine() {
  return {
    type: CLEAR_MACHINE
  }
}




export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
  }
}
