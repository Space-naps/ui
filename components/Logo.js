import React from 'react';
import styles from './Logo.scss';

export default class Logo extends React.Component {
  render() {
    return (
      <header className={styles.brand}>
        <h1 className={styles.logo}>Space Naps</h1>
        <span>Clear for Take Off</span>
      </header>
    );
  }
}