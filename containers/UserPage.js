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
      props.fetchMachine()
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
    const { flight_details, flight } = this.props
    if (!flight_details) {
      return <h1><i>Loading {flight}’s details...</i></h1>
    }

    return (
      <div>
        <User user={flight_details} />
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
    entities: { flights, weathers }
  } = state

  // Haccckkkkk
  let flight = login.toUpperCase()
  let weather = null
  if (flights[flight]) {
    weather = flights[flight].departureAirportFsCode
  }
  return {
    flight,
    flight_details: flights[flight],
    weather: weathers[weather]
  }
}

export default connect(mapStateToProps, {
  loadUser,
  fetchMachine,
  loadWeather
})(UserPage)
