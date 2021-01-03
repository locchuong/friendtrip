import React, { Component } from "react";
import { Button } from "react-bootstrap";
import tripIcon from "../Media/tripIcon.svg";
import friendsIcon from "../Media/friendsIcon.svg";
import homeIcon from "../Media/homeIcon.svg";
import createTripIcon from "../Media/createTripIcon.svg";
import friendtripLogo from "../Media/friendtripLogo.svg";
import friendtripIcon from "../Media/friendtripIcon.svg";
import toggleNavbarIcon from "../Media/toggleNavbarIcon.svg";

import "../Stylesheets/Navbar.css";

class Navbar extends Component {
  render() {
    const showNavbar = !this.props.showNavbar ? "navbar-minimized" : "";
    return (
      <div className={`navbar ${showNavbar} pt-3`}>
        <div className="navbar-header">
          <img
            src={friendtripIcon}
            className="friendtripIcon align-top"
            alt="friendtripIcon"
            id="friendtripIcon"
          />
          <img
            src={friendtripLogo}
            className="friendtripLogo align-top"
            alt="friendtripLogo"
            id="friendtripLogo"
          />
        </div>
        <Button
          className="shadow-none mt-3"
          block
          onClick={(e) => this.props.switchPage("home")}
        >
          <img
            src={homeIcon}
            className="d-inline-block align-top mr-2"
            alt="homeIcon"
            id="homeIcon"
          />
          <h5 className="mb-0">Home</h5>
        </Button>
        <Button
          className="shadow-none"
          block
          onClick={(e) => this.props.switchPage("trips")}
        >
          <img
            src={tripIcon}
            className="d-inline-block align-top mr-2"
            alt="tripIcon"
            id="tripIcon"
          />
          <h5 className="mb-0">Trips</h5>
        </Button>
        <Button
          className="shadow-none"
          block
          onClick={(e) => this.props.switchPage("friends")}
        >
          <img
            src={friendsIcon}
            className="d-inline-block align-top mr-2"
            alt="friendIcon"
            id="friendIcon"
          />
          <h5 className="mb-0">Friends</h5>
        </Button>
        <Button
          className="shadow-none"
          block
          onClick={(e) => this.props.switchPage("createTrip")}
        >
          <img
            src={createTripIcon}
            style={{transform: "scale(0.8)"}}
            className="d-inline-block align-top mr-2"
            alt="createTripIcon"
            id="createTripIcon"
          />
          <h5 className="mb-0">Create Trip</h5>
        </Button>
        <Button
          className="toggleNavbar-btn shadow-none"
          block
          onClick={(e) => this.props.toggleNavbar()}
        >
          <img
            src={toggleNavbarIcon}
            className="toggleNavbarIcon d-inline-block align-top mr-2"
            alt="toggleNavbarIcon"
            id="toggleNavbarIcon"
          />
          <h5 className="mb-0">Toggle Nav</h5>
        </Button>
      </div>
    );
  }
}
export default Navbar;
