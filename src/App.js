import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './Stylesheets/App.css'

import CreateAccount from "./components/account/CreateAccount";
import SignIn from "./components/account/SignIn";
import Home from "./routes/Home.js"

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
          <Route exact path='/home' component={Home} />
        </Router>
      </div>
    );
  }
}

export default App;
