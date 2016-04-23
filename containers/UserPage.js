import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadUser } from '../actions'
import User from '../components/User'
import Repo from '../components/Repo'
import List from '../components/List'
import zip from 'lodash/zip'

function loadData(props) {
  const { flight } = props
  props.loadUser(flight, [ 'name' ])
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
    if (nextProps.flight !== this.props.flight) {
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
}

function mapStateToProps(state, ownProps) {
  let { login } = ownProps.params
  const {
    entities: { flights }
  } = state

  // Haccckkkkk
  let flight = login.toUpperCase()
  return {
    flight,
    flight_details: flights[flight]
  }
}

export default connect(mapStateToProps, {
  loadUser,
})(UserPage)
