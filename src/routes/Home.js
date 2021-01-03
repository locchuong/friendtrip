import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/Navbar";
import Account from "../components/account/Account";
import Friends from "../components/Friends";
import Trips from "../components/trip/Trips";
import Trip from "../components/trip/Trip";
import HomePage from "../components/HomePage";
import CreateTrip from "../components/trip/CreateTrip";
import dropdownIcon from "../Media/dropdownIcon.svg";
import accountIcon from "../Media/accountIcon.svg";
import logoutLogo from "../Media/logoutLogo.svg";
import profileLogo from "../Media/profileIcon.svg";
import navBarImage from "../Media/loginImage.svg";
import Fade from "react-reveal/Fade";
import "../Stylesheets/Home.css";
class Home extends Component {
  constructor(props) {
    super(props);
    this.page = this.switchPage.bind(this);
    this.logout = this.logoutFunc.bind(this);
    this.state = {
      renderedContent: "",
      tripId: "",
      traveler: {},
      showNavbar: true,
    };
    this.toggleNavBar = this.toggleNavBar.bind(this);
  }

  toggleNavBar = () => {
    this.setState(prevState => ({
      showNavbar: !prevState.showNavbar
    }));
  }

  // Send a POST request to the REST API at "api/logout"
  // Handles logout functionality
  logoutFunc = () => {
    fetch("/logout", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          localStorage.clear();
          this.props.history.push("/");
        } else {
          alert("Logout failed.");
        }
      });
  };

  // Handles updating Traveler information THEN swapping pages (if applicable)
  switchPage = (event) => {
    fetch("/account/getAccount/" + this.getUserId(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({ traveler: res.account });
        if (event) this.setState({ renderedContent: event });
      });
  };

  // Handles displaying specific trip page
  selectTrip = (tripId) => {
    this.setState({ tripId, renderedContent: "trip" });
  };

  // Handles getting Traveler id from localStorage
  getUserId = () => {
    return localStorage.getItem("id");
  };

  // Render content based on state
  renderContent() {
    switch (this.state.renderedContent) {
      case "account":
        return (
          <Account
            traveler={this.state.traveler}
            refreshTraveler={this.switchPage}
            user={this.getUserId()}
          ></Account>
        );
      case "trips":
        return (
          <Trips
            tripIds={this.state.traveler.tripIds}
            invitations={this.state.traveler.invitations}
            refreshTraveler={this.switchPage}
            selectTrip={this.selectTrip}
          ></Trips>
        );
      case "trip":
        return (
          <Trip
            switchPage={this.switchPage}
            tripId={this.state.tripId}
            traveler={this.state.traveler}
            history={this.props.history}
          />
        );
      case "friends":
        return <Friends refreshTraveler={this.switchPage} />;
      case "createTrip":
        return <CreateTrip refreshTraveler={this.switchPage}></CreateTrip>;
      default:
        return <HomePage></HomePage>;
    }
  };

  // Get Traveler's information and store it on mount
  componentDidMount() {
    this.switchPage();
  };

  // Redirect Travelers who are not logged in trying to enter the home page
  redirectOnLoggedOut = () => {
    if (!localStorage.getItem("id")) {
      this.props.history.push("/");
    }
  };

  render() {
    const showNavbar = this.state.showNavbar ? "d-inline-block" : "homepage-left-minimized ";
    const resizeHomepage = this.state.showNavbar ? "" : "w-100";
    return (
      <div className="homepage-wrapper">
        {this.redirectOnLoggedOut()}
        <Fade left>
          <div className={`${showNavbar} homepage-left`}>
            <Navbar
              switchPage={this.switchPage}
              className="position-sticky"
              showNavbar={this.state.showNavbar}
              toggleNavbar={this.toggleNavBar}
            ></Navbar>
          </div>
        </Fade>
        <div className={`${resizeHomepage} homepage-right`}>
          {this.renderContent()}
        </div>
        <div className="homepage-account mt-3 pr-3">
          <div className="homepage-profile p-1">
            <img
              src={profileLogo}
              width="25"
              height="25"
              className="d-inline-block align-top"
              alt="profileLogo"
              id="profileLogo"
            />{" "}
            <strong>
              {this.state.traveler.firstName +
                " " +
                this.state.traveler.lastName}
            </strong>
          </div>
          <Dropdown className="ml-4 d-inline-block">
            <Dropdown.Toggle
              className="p-0"
              variant="light"
              id="dropdown-basic"
              bsPrefix="profile-dropdown"
            >
              <img
                src={dropdownIcon}
                width="25"
                height="25"
                className="d-inline-block align-top pb-1 dropdownIcon"
                alt="accountIcon"
                id="accountIcon"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-1 profile-dropdown-menu">
              <Dropdown.Item
                className="profile-dropdown-menu-item"
                onClick={(e) => this.switchPage("account")}
              >
                <img
                  src={accountIcon}
                  width="25"
                  height="25"
                  className="d-inline-block align-top mr-2"
                  alt="accountIcon"
                  id="accountIcon"
                />
                Account
              </Dropdown.Item>
              <Dropdown.Item
                className="profile-dropdown-menu-item"
                onClick={(e) => this.logoutFunc()}
              >
                <img
                  src={logoutLogo}
                  width="24"
                  height="24"
                  className="d-inline-block align-top mr-2"
                  alt="logoutLogo"
                  id="logoutLogo"
                />
                Log out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <ScrollToTop></ScrollToTop>
      </div>
    );
  }
}

export default Home;
