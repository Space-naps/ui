import React, { Component, PropTypes } from 'react'

import changeCase from 'change-case'
import ClearDay from '../img/WeatherLogos/ClearDay.png'
import ClearNight from '../img/WeatherLogos/ClearNight.png'
import Cloudy from '../img/WeatherLogos/Cloudy.png'
import Fog from '../img/WeatherLogos/Fog.png'
import PartlyCloudyDay from '../img/WeatherLogos/PartlyCloudyDay.png'
import PartlyCloudyNight from '../img/WeatherLogos/PartlyCloudyNight.png'
import Rain from '../img/WeatherLogos/Rain.png'
import Sleet from '../img/WeatherLogos/Sleet.png'
import Snow from '../img/WeatherLogos/Snow.png'
import Wind from '../img/WeatherLogos/Wind.png'


let icons = {
  ClearDay,
  ClearNight,
  Cloudy,
  Fog,
  PartlyCloudyDay,
  PartlyCloudyNight,
  Rain,
  Sleet,
  Snow,
  Wind
}

export default class WeatherIcon extends Component {
  render() {
    let type = changeCase.pascalCase(this.props.icon);
    console.log(icons, type, icons[type])
    return <img src={icons[type]}/>
  }
}
