import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import styles from './Spinner.scss'

export default class Spinner extends Component {

  render() {
    return (
      <div className={styles.wrap}><div className={styles.spinner}><i className="fa fa-spinner fa-spin fa-5x" aria-hidden="true"></i></div></div>
    )
  }
}
