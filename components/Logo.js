import React from 'react';
import styles from './Logo.scss';

import logo from '../img/FlytoLogo.png'

export default class Logo extends React.Component {
  render() {
    return (
      <header className={styles.header}>
        <h1><img src={logo} alt="FlyTo logo" title="FlyTo" /></h1>
      </header>
    );
  }
}