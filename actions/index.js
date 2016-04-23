import { CALL_API, Schemas } from '../middleware/api'
import moment from 'moment'

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

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
      endpoint: `flight/status/${carrier}/${flight}/dep/${year}/${month}/${day}`,
      schema: Schemas.FLIGHT,
    }
  }
}

function* entries(obj) {
   for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
   }
}


export function fetchMachinLearning(data) {
  var machineLearning = ''
  for (let [key, value] of entries(myObj)) {
    machineLearing = machineLearing + '&${key}=${value}'
}
  return {
    types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
    endpoint: 'https://asiasoutheast.services.azureml.net/workspaces/fd13a298d4c34a60917e0bdb8ddc63cd/services/298b8d5eb9e9445c8cec08a549eb608d/execute?api-version=2.0&details=true'
    // schema: Schemas.MACHINE,
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

export const REPO_REQUEST = 'REPO_REQUEST'
export const REPO_SUCCESS = 'REPO_SUCCESS'
export const REPO_FAILURE = 'REPO_FAILURE'



export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
  }
}
