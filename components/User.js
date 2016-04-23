import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class User extends Component {
  render() {
    const { departureAirportFsCode, arrivalAirportFsCode, name } = this.props.user

    return (
      <div className="User">
        {departureAirportFsCode}<br/>
        {arrivalAirportFsCode}<br/>
        {this.props.user.operationalTimes.publishedDeparture.dateLocal}<br/>
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
