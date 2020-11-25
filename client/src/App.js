import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import CreateAccount from "./components/CreateAccount";
import SignIn from "./components/SignIn";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <Router>
          <Route exact path='/' component={SignIn} />
          <Route exact path='/signup' component={CreateAccount} />
        </Router>
      </div>
    );
  }
}

export default App;
