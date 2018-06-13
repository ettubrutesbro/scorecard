import React, { Component } from 'react';
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import styles from './App.module.css'

@observer
class App extends Component {
  @observable testObservable = 'hello'
  render() {
    return (
      <div className={styles.testModule}>
        wowwww {this.testObservable}
      </div>
    );
  }
}

export default App;
