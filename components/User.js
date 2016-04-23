import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class User extends Component {
  render() {
    const { departureAirportFsCode, arrivalAirportFsCode, name } = this.props.user

    return (
      <div className="User">
        {departureAirportFsCode} to        {arrivalAirportFsCode}<br/>
        {this.props.user && this.props.user.operationalTimes.publishedDeparture.dateLocal}<br/>
        {this.props.weather && `${this.props.weather.currently.summary} ${this.props.weather.currently.temperature} degrees`}
      </div>
    )
  }
}

User.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string,
    name: PropTypes.string
  }).isRequired
}
