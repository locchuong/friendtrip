import React, { Component } from "react";
import { ListGroup, Button, Card } from "react-bootstrap";

import AddTraveler from "./modals/AddTraveler";
import travelersIcon from "../../Media/travelersIcon.svg";

import "../../Stylesheets/Travelers.css";
class Travelers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      showAddTraveler: false,
      travelers: [],
      friendIds: [],
    };

    this.openAddTravelerModal = this.openAddTravelerModal.bind(this);
    this.closeAddTravelerModal = this.closeAddTravelerModal.bind(this);
  }

  closeAddTravelerModal = () => {
    this.setState({ showAddTraveler: false });
  };

  openAddTravelerModal = () => {
    this.setState({ showAddTraveler: true });
  };

  removeTraveler = (travelerId) => {
    const isTripLeader = this.props.tripLeaders.includes(travelerId);
    const data = {
      tripId: this.props.tripId,
      travelerId,
      isTripLeader,
    };

    fetch("/trip/leaveTrip", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      this.props.refreshTrip();
    });
  };

  getTravelersJSON = (travelerIds) => {
    fetch("/trip/getTravelers/" + travelerIds, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        var friends;
        if (!this.props.friendIds) friends = [];
        else friends = this.props.friendIds;

        // Friend Ids that aren't in the Trip
        friends = friends.filter((value) => !travelerIds.includes(value));
        this.setState({
          travelers: res.travelers,
          friendIds: friends,
          render: true,
        });
      });
  };

  createTraveler = (traveler) => {
    const name = traveler.firstName + " " + traveler.lastName;
    var remove, strong;
    if (
      this.props.isTripLeader() &&
      traveler.id !== this.props.tripOwner &&
      traveler.id !== this.props.travelerId
    ) {
      remove = (
        <span
          onClick={() => {
            this.removeTraveler(traveler.id);
          }}
          id={traveler.id}
          className="close"
        >
          ❌
        </span>
      );
    }
    if (traveler.id === this.props.tripOwner) strong = <p>{name}</p>;
    else strong = name;

    return (
      <ListGroup.Item key={traveler.id} className="pb-1 pt-1">
        {remove}
        {strong}
      </ListGroup.Item>
    );
  };

  renderTravelers = () => {
    if (!this.state.travelers) return;
    var travelersJSX = [];
    for (const traveler of this.state.travelers) {
      travelersJSX.push(this.createTraveler(traveler));
    }
    return travelersJSX;
  };

  componentWillReceiveProps(nextProps) {
    this.getTravelersJSON(nextProps.travelerIds);
  }

  componentDidMount() {
    this.getTravelersJSON(this.props.travelerIds);
  }

  render() {
    if (!this.state.render) return <div></div>;
    return (
      <div>
        <AddTraveler
          id={this.props.id}
          friendIds={this.state.friendIds}
          show={this.state.showAddTraveler}
          handleClose={this.closeAddTravelerModal}
        />

        <Card className="travelers-list">
          <Card.Header className="travelers-list-header p-1 pl-3">
            <img
              src={travelersIcon}
              width="25"
              height="25"
              className="travelers-list-icon d-inline-block align-top mr-2 "
              alt="travelersIcon"
              id="travelersIcon"
            />
            <strong>Travelers</strong>
          </Card.Header>
          <ListGroup variant="flush">
            {this.renderTravelers()}
            <Button variant="light" onClick={this.openAddTravelerModal}>
              Add Traveler
            </Button>
          </ListGroup>
        </Card>
      </div>
    );
  }
}

export default Travelers;
