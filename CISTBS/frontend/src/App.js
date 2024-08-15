import React, { Component, Fragment } from "react";
import logo from './logo.svg';
import Incidents from "./components/Incidents";

class App extends Component {
  render() {
    return (
      <Fragment>
        <Incidents />
      </Fragment>
    );
  }
}

export default App;
