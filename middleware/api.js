import { Schema, arrayOf, unionOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import 'isomorphic-fetch'
import airport_codes from '../actions/airport_codes.json'
import moment from 'moment'

let codes_to_airport = {}
for (let airport of Object.keys(airport_codes)) {
  let code = airport_codes[airport]
  codes_to_airport[code] = airport
}

// Extracts the next page URL from Github API response.
function getNextPageUrl(response) {
  const link = response.headers.get('link')
  if (!link) {
    return null
  }

  const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)
  if (!nextLink) {
    return null
  }

  return nextLink.split(';')[0].slice(1, -1)
}



// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(fullUrl, schema, method='GET', body=null, headers={}) {
  let options = {method, headers}
  if (body) {
    options.body = JSON.stringify(body)
  }
  return fetch(fullUrl, options)
    .then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }

      const camelizedJson = camelizeKeys(json)
      const nextPageUrl = getNextPageUrl(response)

      return Object.assign({},
        normalize(camelizedJson, schema),
        { nextPageUrl }
      )
    })
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/gaearon/normalizr


function generateFlightCode(entity) {
  let date = moment(entity.departureDate.dateLocal)

  let retval = `${entity['carrierFsCode']}${entity['flightNumber']}/${date.format('DDD')}`
  console.log("Incoming key?", retval)
  return retval
}
const flightCode = new Schema('flights', {idAttribute: generateFlightCode})
const airportSchema = new Schema('airports', {idAttribute: 'iata'})
const flightDetails = new Schema('flightDetails');
flightDetails.define({
  appendix: {airports: arrayOf(airportSchema)},
  flightStatuses: arrayOf(flightCode)
});

function generateWeatherCode(entity) {
  let key = `${entity.longitude},${entity.latitude}`
  return key
}
const weather = new Schema('weathers', {idAttribute: generateWeatherCode})

function generateMachineId(entity) {
  // console.log("Generating machine ids")
  // return `${codes_to_airport[entity.results.output1.value.values[0][3]]}-${codes_to_airport[entity.results.output1.value.values[0][4]]}-${entity.results.output1.value.values[0][2]}`
  return 0
}

const machine = new Schema('machines', {idAttribute: generateMachineId})


// Schemas for Github API responses.
export const Schemas = {
  FLIGHT: flightDetails,
  WEATHER: weather,
  MACHINE: machine
}





// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API')

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint, method, body, headers } = callAPI
  const { schema, types } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  return callApi(endpoint, schema, method, body, headers).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
