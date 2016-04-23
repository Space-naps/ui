import { CALL_API, Schemas } from '../middleware/api'
import moment from 'moment'
import airport_coordinates from './airport_coordinates.json'

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'


const API_ROOT = 'https://flightstats-api.herokuapp.com/flex/flightstatus/rest/v2/json/'
const AUTH_STRING = '?appId=0f80d303&appKey=64a8a2b28e2b5efee4a869e447060268&utc=false'



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


// Fetches a weather forecast for a day using the forecast.io API.
// Relies on the custom API middleware defined in ../middleware/api.js.
export function fetchWeather(airport_code, unix_time) {
  var latitude = airport_coordinates[airport_code]["lat"];
  var longitude = airport_coordinates[airport_code]["long"];
  var API_KEY = "8aaa1191e7da730e86d8a96f5032d132"
  console.log(latitude, longitude, API_KEY);
  return {
    [CALL_API]: {
      types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
      endpoint: `https://api.forecast.io/forecast/${API_KEY}/${latitude},${longitude},${unix_time}`,
      schema: Schemas.FLIGHT,
    }
  }
}

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadUser(flight, requiredFields = []) {
  return (dispatch, getState) => {
    const flight_details = getState().entities.flights[flight]
    if (flight_details && requiredFields.every(key => flight_details.hasOwnProperty(key))) {
      return null
    }

    let regex = /([a-zA-Z]+)(\d+)/;
    let result = flight.match(regex);
    if(result) {
      let [dummy, airline, flight_num] = result;
      return dispatch(fetchUser(airline, flight_num))
    }
  }
}


export const MACHINE_REQUEST = 'MACHINE_REQUEST'
export const MACHINE_SUCCESS = 'MACHINE_SUCCESS'
export const MACHINE_FAILURE = 'MACHINE_FAILURE'

export function fetchMachine() {
  return {
    [CALL_API]: {
      types: [ MACHINE_REQUEST, MACHINE_SUCCESS, MACHINE_FAILURE ],
      endpoint: `https://asiasoutheast.services.azureml.net/workspaces/fd13a298d4c34a60917e0bdb8ddc63cd/services/298b8d5eb9e9445c8cec08a549eb608d/execute?api-version=2.0&details=true`,
      schema: Schemas.FLIGHT,
      method: 'POST',
      body: {test: 'blah'}
    }
  }
}




export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
  }
}
