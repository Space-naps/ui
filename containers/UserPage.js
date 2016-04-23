import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadUser, fetchMachine, loadWeather } from '../actions'
import User from '../components/User'
import Repo from '../components/Repo'
import List from '../components/List'
import zip from 'lodash/zip'

function loadData(props) {
  const { flight, flight_details, weather } = props
  props.loadUser(flight, [ 'name' ])
  if (flight_details) {
    props.loadWeather(flight_details.departureAirportFsCode, flight_details.operationalTimes.publishedDeparture.dateLocal)
    if (weather) {
      props.fetchMachine(flight_details.operationalTimes.publishedDeparture.dateLocal, flight_details, weather)
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
    if (nextProps.flight !== this.props.flight || 
      (nextProps.flight_details && !this.props.flight_details) ||
      (nextProps.weather && !this.props.weather)) {
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
        <hr />
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
  let { login } = ownProps.params
  const {
    entities: { flights, weathers, machines }
  } = state

  // Haccckkkkk
  let flight = login.toUpperCase()
  let weather = null
  let prediction = null
  if (flights[flight]) {
    weather = flights[flight].departureAirportFsCode
    if (weather && machines) {
      let key = `${flights[flight].departureAirportFsCode}-${flights[flight].carrierFsCode}`
      if (key in machines) {
        let machine = machines[key]
        prediction = {
          'likely': machine.results.output1.value.values[0][22],
          'probability': machine.results.output1.value.values[0][23]
        }
      }
    }
  }
  return {
    flight,
    flight_details: flights[flight],
    weather: weathers[weather],
    prediction: prediction
  }
}

export default connect(mapStateToProps, {
  loadUser,
  fetchMachine,
  loadWeather
})(UserPage)
