import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import numeral from 'numeral'
import classnames from 'classnames'
import Spinner from './Spinner'
import WeatherIcon from './WeatherIcon'

import styles from './User.scss'
import appStyles from '../containers/App.scss'

export default class User extends Component {
  percentage() {
    if (this.props.prediction) {
      return numeral(this.props.prediction.probability).format('0%')
    } else {
      return <Spinner/>
    }
  }

  render() {
    const { departureAirportFsCode, arrivalAirportFsCode, name } = this.props.user

    return (
      <div className={classnames(styles.user, appStyles['result'], appStyles['align-center'])}>
        <div className={styles.results}>
          {this.props.weather && <WeatherIcon icon={this.props.weather.currently.icon}/>}
          <p className={styles.text}>The likelyhood of your flight being delayed:</p>
          <p className={styles.probability}>{this.percentage()}</p>
        </div>
        <p className={styles.subtext}>Don't go out without an umbrella!</p>

      </div>
    )
    //        {departureAirportFsCode} to        {arrivalAirportFsCode}<br/>

    // {this.props.user && this.props.user.operationalTimes.publishedDeparture.dateLocal}<br/>
    //     {this.props.weather && `${this.props.weather.currently.summary} ${this.props.weather.currently.temperature} degrees`}<br/>
    //     {this.props.prediction && `${this.props.prediction.likely} - ${this.props.prediction.probability}`}
    //     {!this.props.prediction && "Loading prediction..."}
  }
}

User.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string,
    name: PropTypes.string
  }).isRequired
}
