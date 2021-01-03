import React, { Component } from "react";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import tripPageImage from "../../Media/tripPageImage.svg";
import tripIcon from "../../Media/tripIcon.svg";
import "../../Stylesheets/Trips.css";

class Trips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: [],
      invitedTrips: [],
      owners: {},
    };
  }

  // Handles getting current Trips' owner ids
  getOwnerIds = (trips) => {
    var owners = [];
    for (const trip of trips) {
      owners.push(trip.travelerId);
    }
    return owners;
  };

  // Handles getting current Trips, delegates getting owner names to GetOwnerNames()
  getTripsJSON = (tripIds) => {
    if (tripIds) {
      fetch("/trip/getTrips/" + tripIds, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          this.getOwnerNames(res.trips);
        });
    }
  };

  // Handles getting current Trips' owner name
  getOwnerNames = (trips) => {
    fetch("/trip/getTravelers/" + this.getOwnerIds(trips), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let owners = {};
        for (let traveler of res.travelers) {
          owners[traveler.id] = traveler.firstName + " " + traveler.lastName;
        }
        this.setState({ trips, owners });
      });
  };

  // Handles getting Trip invitations of the Traveler
  getInvitedTripsJSON = (tripIds) => {
    if (tripIds) {
      fetch("/trip/getTrips/" + tripIds, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          this.setState({ invitedTrips: res.trips });
        });
    }
    else {
      this.setState({ invitedTrips: []});
    }
  };

  // Handles accept/reject trip invite
  handleInvitation = (tripId, method) => {
    const data = { travelerId: this.getUserId(), tripId };
    fetch("/trip/" + method, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      this.props.refreshTraveler();
    });
  };

  getUserId = () => {
    return localStorage.getItem("id");
  };

  createTrip = (trip) => {
    const ownerName = this.state.owners[trip.travelerId];
    return (
      <ListGroup.Item
        className="d-inline-block w-80 pb-1 pt-1"
        key={trip.id}
        action
        onClick={() => this.props.selectTrip(trip.id)}
      >
        <Row
          style={{ color: "black" }}
          className="align-items-center text-center"
        >
          <Col xs={2}><p>{trip.name}</p></Col>
          <Col xs={2}><p>{ownerName}</p></Col>
          <Col xs={2}><p>{Object.keys(trip.travelerIds).length}</p></Col>
          <Col><p>{trip.description}</p></Col>
        </Row>
      </ListGroup.Item>
    );
  };

  renderTrips() {
    if (!this.state.trips) return;
    var tripsJSX = [];
    for (const trip of this.state.trips) {
      tripsJSX.push(this.createTrip(trip));
    }
    return tripsJSX;
  }

  createInvitation = (invite) => {
    if (!invite) return <div></div>;
    return (
      <Row
        className="trips-invite m-0 text-center p-1"
        key={invite.id}
        id={"row" + invite.id}
      >
        <Col xs={2}>{invite.name}</Col>
        <Col xs={5}>{invite.description}</Col>
        <Col>
          <Button
            onClick={() => {
              this.handleInvitation(invite.id, "acceptInvite");
            }}
            variant="success"
          >
            Accept
          </Button>{" "}
          <Button
            onClick={() => {
              this.handleInvitation(invite.id, "rejectInvite");
            }}
            className="ml-3"
            variant="danger"
          >
            Decline
          </Button>
        </Col>
      </Row>
    );
  };

  renderInvitations() {
    var invitesJSX = [];
    if (!this.state.invitedTrips) return invitesJSX;
    for (const invite of this.state.invitedTrips) {
      invitesJSX.push(this.createInvitation(invite));
    }
    return invitesJSX;
  }

  componentWillReceiveProps(nextProps) {
    this.getTripsJSON(nextProps.tripIds);
    this.getInvitedTripsJSON(nextProps.invitations);
  }

  componentDidMount() {
    this.getTripsJSON(this.props.tripIds);
    this.getInvitedTripsJSON(this.props.invitations);
  }

  render() {
    return (
      <div className="w-100 h-100">
        <div className="trips-page-header">
          <img
            src={tripIcon}
            width="40"
            height="40"
            className="d-inline-block align-top mr-2"
            alt="tripIcon"
            id="tripIcon"
          />
          <h1 className="d-inline-block">
            <strong>Trips</strong>
          </h1>
        </div>

        <hr></hr>

        {/* TRIP INVITATIONS */}
        <Card className="trips-list" style={{ width: "100%" }}>
          <Card.Header className="trips-list-header pt-1 pb-1">
            <h4> Trip Invitations </h4>
          </Card.Header>
          <Card.Body className="trips-list-body">
            <Container fluid>
              <Row className="m-0 text-center">
                <Col xs={2}>
                  <h5>Trip Name</h5>
                </Col>
                <Col xs={5}>
                  <h5>Description</h5>
                </Col>
                <Col></Col>
              </Row>
              {this.renderInvitations()}
            </Container>
          </Card.Body>
        </Card>

        {/* VIEW MY TRIPS */}
        <Card className="trips-list mt-3" style={{ width: "100%" }}>
          <Card.Header className="trips-list-header pb-1 pt-1">
            <h4> My Trips </h4>
          </Card.Header>
          <Card.Body className="trips-list-body">
            <Container fluid>
              <Row className="m-0 text-center">
                <Col xs={2}>
                  <h5>Trip Name</h5>
                </Col>
                <Col xs={2}>
                  <h5>Owner</h5>
                </Col>
                <Col xs={2}>
                  <h5>Members</h5>
                </Col>
                <Col>
                  <h5>Description</h5>
                </Col>
              </Row>
              {this.renderTrips()}
            </Container>
          </Card.Body>
        </Card>
        <img
          src={tripPageImage}
          className="page-background-image"
          alt="tripPageImage"
          id="tripPageImage"
        />
      </div>
    );
  }
}

export default Trips;
