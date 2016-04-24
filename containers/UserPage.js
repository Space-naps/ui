import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadUser, fetchMachine, loadWeather, clearMachine } from '../actions'
import User from '../components/User'
import Repo from '../components/Repo'
import List from '../components/List'
import zip from 'lodash/zip'
import moment from 'moment'

function loadData(props) {
  let { flight, flight_details, weather, destWeather, date } = props
  props.clearMachine()

  let year = null
  let month = null
  let day = null
  if (date) {
    date = moment(date)
    year = date.year()
    month = date.month() + 1
    day = date.date()

  }

  props.loadUser(flight, year, month, day)
  if (flight_details) {
    props.loadWeather(flight_details.departureAirportFsCode, flight_details.departureDate.dateLocal)
    props.loadWeather(flight_details.arrivalAirportFsCode, flight_details.arrivalDate.dateLocal)
    if (weather && destWeather) {
      props.fetchMachine(flight_details.departureDate.dateLocal, flight_details.arrivalDate.dateLocal, flight_details, weather, destWeather)
    }
  }



}

class UserPage extends Component {
  constructor(props) {
    super(props)
    this.renderRepo = this.renderRepo.bind(this)
  }

  componentWillMount() {
    loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    console.log("Should we load?", nextProps.flight, this.props.flight)
    if (nextProps.flight !== this.props.flight ||
      (nextProps.flight_details && !this.props.flight_details) ||
      (nextProps.weather && !this.props.weather) ||
      (nextProps.destWeather && !this.props.destWeather) ||
      (nextProps.date !== nextProps.date)) {
      console.log("Loading")
      loadData(nextProps)
    }
  }

  renderRepo([ repo, owner ]) {
    return (
      <Repo repo={repo}
            owner={owner}
            key={repo.fullName} />
    )
  }

  render() {
    const { flight_details, flight, weather, prediction } = this.props
    if (!flight_details) {
      return <h1><i>Loading {flight}’s details...</i></h1>
    }

    return (
      <div>
        <User user={flight_details} weather={weather} prediction={prediction} />
      </div>
    )
  }
}

UserPage.propTypes = {
  flight: PropTypes.string.isRequired,
  flight_details: PropTypes.object,
  loadUser: PropTypes.func.isRequired,
  loadWeather: PropTypes.func.isRequired,
}

function mapStateToProps(state, ownProps) {
  let { login, date } = ownProps.params
  const {
    entities: { flights, weathers, machines, airports }
  } = state

  // Haccckkkkk
  let flight = login.toUpperCase()
  let depCode = null
  let arrCode = null
  let prediction = null

  let depWeather = null;
  let arrWeather = null;

  if (!date) {
    date = moment()
  } else {
    date = moment(`${date}`, 'x')
  }

  let flight_key = `${flight}/${date.format('DDD')}`
  console.log("mapping flight key", flight_key)
  if (flights[flight_key]) {
    depCode = flights[flight_key].departureAirportFsCode
    arrCode = flights[flight_key].arrivalAirportFsCode

    let depLong = airports[depCode].longitude;
    let depLat = airports[depCode].latitude;

    let arrLong = airports[depCode].longitude
    let arrLat = airports[depCode].latitude

    depWeather = weathers[`${depLong},${depLat}`];
    arrWeather = weathers[`${arrLong},${arrLat}`]

    if (depCode && arrCode && machines) {
      let machine = machines[0]
      if (machine) {
        prediction = {
          'likely': machine.results.output1.value.values[0][20],
          'probability': machine.results.output1.value.values[0][21]
        }
      }

    }
  }
  return {
    flight,
    date,
    flight_details: flights[flight_key],
    weather: depWeather,
    destWeather: arrWeather,
    prediction: prediction
  }
}

export default connect(mapStateToProps, {
  loadUser,
  fetchMachine,
  loadWeather,
  clearMachine
})(UserPage)
