import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import DateTime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import styles from './Explore.scss'
import moment from 'moment'

const GITHUB_REPO = 'https://github.com/reactjs/redux'

export default class Explore extends Component {
  constructor(props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.state = {flight: '', date: null}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.state = {...this.state, ...this.props.value}
    }
  }

  handleKeyUp(e) {
    this.state = {...this.state, flight: e.target.value}
    this.handleChange(this.state)
  }

  handleDateChange(e) {
    this.state = {...this.state, date: e.valueOf()};
    this.handleChange(this.state)
  }

  handleChange = _.debounce(this.props.onChange, 300)


  isValidDate(currentDate, selectedDate) {
    let three_days = moment().add(2, 'day')
    return currentDate.isBefore(three_days)
  }

  render() {
    return (
      <div className={styles.form}>
        <label htmlFor='flight-no'>
          <p>What's your flight number?</p>
        </label>
        <input className={styles['form-control']} id='flight-no' 
               placeholder='Flight no.'
               defaultValue={this.props.value.flight}
               onKeyUp={this.handleKeyUp} />
        <p>When are you flying?</p>
        <DateTime className={`${styles['datepicker']}`} isValidDate={this.isValidDate}
          onChange={this.handleDateChange}
          timeFormat={false} defaultValue={this.props.value.date || moment()}
          closeOnSelect={true} />
      </div>
    )
  }
}

Explore.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}
