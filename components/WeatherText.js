import React, { Component } from 'react'
import changeCase from 'change-case'
import styles from './User.scss'

let text = {
  ClearDay: "Remember, sunscreen is a gift from your past self to your future self",
  ClearNight: "Have a good flight!",
  Cloudy: "Have a good flight!",
  Fog: "Yellow lights save lives",
  PartlyCloudyDay: "Have a good flight!",
  PartlyCloudyNight: "Have a good flight!",
  Rain: "Don't go out without an umbrella!",
  Sleet: "Lord Stark sends his regards",
  Snow: "Lord Stark sends his regards",
  Wind: "You didn’t have any clothes drying outside, did you?"
};

export default class WeatherText extends Component {
  render() {
    let type = changeCase.pascalCase(this.props.weather);
    return (
      <p className={styles.subtext}>{text[type]}</p>
    )
  }
}