import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Logo from '../components/Logo';
import Explore from '../components/Explore'
import { resetErrorMessage } from '../actions'
import moment from 'moment'
import classnames from 'classnames';
import styles from './App.scss';

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleDismissClick = this.handleDismissClick.bind(this)
  }

  handleDismissClick(e) {
    this.props.resetErrorMessage()
    e.preventDefault()
  }

  handleChange(nextValue) {
    let {flight, date} = nextValue;
    if (flight) {
      if (date) {
        browserHistory.push(`/${flight}/${date}`)
      } else {
        browserHistory.push(`/${flight}`)
      }
    }
  }

  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </p>
    )
  }

  render() {
    const { children, inputValue } = this.props;

    return (
      <div className={classnames(styles.app, styles['fill-screen'], styles['align-center'])}>
    <a href="https://github.com/Space-naps/ui/"><img style={{position: "absolute", top: 0, left: 0, border: 0}} src="https://camo.githubusercontent.com/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"/></a>

        <div className={classnames(styles.splash, styles['align-center'])}>
          <Logo />
          <Explore style={{ color: '#000'}} value={inputValue}
                  onChange={this.handleChange} />
        </div>  
        <div>
          {this.renderErrorMessage()}
          {children}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  // Injected by React Redux
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  inputValue: PropTypes.shape({
    flight: PropTypes.string.isRequired,
    date: PropTypes.object
  }).isRequired,
  // Injected by React Router
  children: PropTypes.node
}

function mapStateToProps(state, ownProps) {
  let [dummy, flight, date] = ownProps.location.pathname.split('/')
  if (date) {
    date = moment(date, 'x');
  }
  return {
    errorMessage: state.errorMessage,
    inputValue: {flight, date}
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage
})(App)
