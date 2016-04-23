import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import DateTime from 'react-datetime'

import 'react-datetime/css/react-datetime.css'
import styles from './Explore.scss'

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

  render() {
    return (
      <div>
        <p>Enter a flight number</p>
        <input size="45"
               defaultValue={this.props.value.flight}
               onKeyUp={this.handleKeyUp} />
        <DateTime onChange={this.handleDateChange} timeFormat={false} defaultValue={this.props.value.date} />

        <p>
          Move the DevTools with Ctrl+W or hide them with Ctrl+H.
        </p>
        <p className={styles.test}>Add something new here</p>
      </div>
    )
  }
}

Explore.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}
