import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Logo from '../components/Logo';
import Explore from '../components/Explore'
import { resetErrorMessage } from '../actions'
import moment from 'moment'
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
    var bgStyle = { 
      backgroundImage: 'url(/img/splash-bg.png)'
    };
    
    return (
      <div className={styles.app} style={bgStyle}>
        <Logo />
        <div className={styles.splash}>
          <Explore style={{ color: '#000'}} value={inputValue}
                  onChange={this.handleChange} />
        </div>  
        <hr />
        {this.renderErrorMessage()}
        {children}
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
    date: PropTypes.object.isRequired
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
