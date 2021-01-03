import React, { Component } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

import Travelers from "./Travelers";
import Notes from "./Notes";
import Destinations from "./Destinations";
import Items from "./Items";
import Expenses from "./Expenses";

import ConfirmDelete from "./modals/ConfirmDelete";
import ConfirmLeave from "./modals/ConfirmLeave";
import EditTrip from "./modals/EditTrip";
import AddTripLeader from "./modals/AddTripLeader";

import tripIcon from "../../Media/tripIcon.svg";
import "../../Stylesheets/Trip.css";

class Trip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      showDeleteTrip: false,
      showLeaveTrip: false,
      showEditTrip: false,
      showAddItem: false,
      showAddTripLead: false,
      tripData: {},
      travelers: {},
    };

    // Handle modal visibility
    this.openDeleteTripModal = this.openDeleteTripModal.bind(this);
    this.closeDeleteTripModal = this.closeDeleteTripModal.bind(this);

    this.closeLeaveTripModal = this.closeLeaveTripModal.bind(this);
    this.openLeaveTripModal = this.openLeaveTripModal.bind(this);

    this.openEditTripModal = this.openEditTripModal.bind(this);
    this.closeEditTripModal = this.closeEditTripModal.bind(this);

    this.openAddItemModal = this.openAddItemModal.bind(this);
    this.closeAddItemModal = this.closeAddItemModal.bind(this);

    this.openAddTripLeaderModal = this.openAddTripLeaderModal.bind(this);
    this.closeAddTripLeaderModal = this.closeAddTripLeaderModal.bind(this);
  }

  // Handle modal visibility
  closeDeleteTripModal = () => {
    this.setState({ showDeleteTrip: false });
  };

  openDeleteTripModal = () => {
    this.setState({ showDeleteTrip: true });
  };

  closeLeaveTripModal = () => {
    this.setState({ showLeaveTrip: false });
  };

  openLeaveTripModal = () => {
    this.setState({ showLeaveTrip: true });
  };

  closeEditTripModal = () => {
    this.setState({ showEditTrip: false });
  };

  openEditTripModal = () => {
    this.setState({ showEditTrip: true });
  };

  closeAddItemModal = () => {
    this.setState({ showAddItem: false });
  };

  openAddItemModal = () => {
    this.setState({ showAddItem: true });
  };

  closeAddTripLeaderModal = () => {
    this.setState({ showAddTripLead: false });
  };

  openAddTripLeaderModal = () => {
    this.setState({ showAddTripLead: true });
  };

  // Retrieve all releveant data
  getTripJSON = (callback) => {
    fetch("/trip/getTrip/" + this.props.tripId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // this.setState({ tripData: res.trip, render: true });
        // if (callback) callback();
        this.getTravelersJSON(res.trip, callback);
      });
  };



  getTravelersJSON = (tripData, callback) => {
    fetch("/trip/getTravelers/" + tripData.travelerIds, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        var travelers = {};
        for (const traveler of res.travelers) {
          travelers[traveler.id] = traveler.firstName + " " + traveler.lastName;
        }
        this.setState({ travelers, tripData, render: true});
        if(callback) callback();
        console.log(travelers);
      });
  };


  // Returns id of current user (Similar to Email, but without the dot)
  getUserId = () => {
    return localStorage.getItem("id");
  };

  // True if user is Trip Leader, Otherwise false.
  isTripLeader = () => {
    return this.state.tripData.tripLeaders.includes(this.getUserId());
  };

  isTripOwner = () => {
    return this.state.tripData.travelerId === this.props.traveler.id;
  };

  // Delete Trip Button [Only visible to Trip Leaders, includes Trip Owner]
  showDeleteTrip = () => {
    if (this.isTripLeader())
      return (
        <div>
          <Button
            variant="danger"
            className="float-right ml-1"
            onClick={this.openDeleteTripModal}
          >
            Delete Trip
          </Button>

          <Button
            variant="warning"
            className="float-right ml-1"
            onClick={this.openAddTripLeaderModal}
          >
            Manage Trip Leaders
          </Button>
        </div>
      );
  };

  // Leave Trip Button [Only visible to Travlers that are not the Trip Owner]
  showLeaveTrip = () => {
    if (!this.isTripOwner()) {
      return (
        <Button
          variant="warning"
          className="float-right ml-1"
          onClick={this.openLeaveTripModal}
        >
          Leave Trip
        </Button>
      );
    }
  };

  refreshTripJSON = (callback) => {
    this.getTripJSON(callback);
  };

  componentDidMount() {
    this.getTripJSON();
  }

  render() {
    if (!this.state.render) return <div></div>;
    return (
      <div className="w-100 h-100">
        <div className="trip-page-header">
          <img
            src={tripIcon}
            width="40"
            height="40"
            className="d-inline-block align-top mr-2"
            alt="tripIcon"
            id="tripIcon"
          />
          <h1 className="d-inline-block">
            <strong> Trips</strong>
          </h1>
        </div>
        <hr></hr>
        {/* MODALS */}
        <ConfirmDelete
          tripId={this.state.tripData.id}
          travelerIds={this.state.tripData.travelerIds}
          itemIds={this.state.tripData.itemIds}
          expenseIds={this.state.tripData.expenseIds}
          destinationIds={this.state.tripData.destinationIds}
          history={this.props.history}
          show={this.state.showDeleteTrip}
          refreshTrip={this.refreshTripJSON}
          switchPage={this.props.switchPage}
          handleClose={this.closeDeleteTripModal}
        ></ConfirmDelete>
        <ConfirmLeave
          tripId={this.state.tripData.id}
          travelerId={this.props.traveler.id}
          isTripLeader={this.isTripLeader}
          history={this.props.history}
          show={this.state.showLeaveTrip}
          refreshTrip={this.refreshTripJSON}
          switchPage={this.props.switchPage}
          handleClose={this.closeLeaveTripModal}
        ></ConfirmLeave>
        <AddTripLeader
          tripId={this.state.tripData.id}
          tripOwner={this.state.tripData.travelerId}
          travelerIds={this.state.tripData.travelerIds}
          tripLeaders={this.state.tripData.tripLeaders}
          show={this.state.showAddTripLead}
          refreshTrip={this.refreshTripJSON}
          handleClose={this.closeAddTripLeaderModal}
        ></AddTripLeader>
        <EditTrip
          tripId={this.state.tripData.id}
          name={this.state.tripData.name}
          description={this.state.tripData.description}
          show={this.state.showEditTrip}
          refreshTrip={this.refreshTripJSON}
          handleClose={this.closeEditTripModal}
        ></EditTrip>
        {/* Trip Details */}
        <Card className="trip-list w-100 mb-5">
          <Card.Body className="trip-list-body p-4">
            <h2 className="pl-3">{this.state.tripData.name}</h2>
            <h5 className="pl-3">
              {" "}
              <strong>Description:</strong> {this.state.tripData.description}
            </h5>
            <hr className="mr-3 ml-3"></hr>
            <Container fluid>
              {/* Notes */}
              <Row>
                <Col className="mb-3" md={12} lg={3}>
                  <Notes
                    id={this.state.tripData.id}
                    notes={this.state.tripData.itinerary}
                    refreshTrip={this.refreshTripJSON}
                  />
                </Col>
              {/* Destinations */}
                <Col className="mb-3" md={12} lg={9}>
                  <Destinations
                    tripId={this.state.tripData.id}
                    travelerId={this.props.traveler.id}
                    destinationIds={this.state.tripData.destinationIds}
                    refreshTrip={this.refreshTripJSON}
                  />
                </Col>
              </Row>
              {/* Items */}
              <Row>
                <Col md={12} lg={8}>
                  <Items
                    travelerId={this.props.traveler.id}
                    travelerIds={this.state.tripData.travelerIds}
                    travelers={this.state.travelers}
                    tripId={this.state.tripData.id}
                    itemIds={this.state.tripData.itemIds}
                    category="Group"
                    refreshTrip={this.refreshTripJSON}
                  />
                  <Items
                    travelerId={this.props.traveler.id}
                    travelerIds={this.state.tripData.travelerIds}
                    travelers={this.state.travelers}
                    tripId={this.state.tripData.id}
                    itemIds={this.state.tripData.itemIds}
                    category="Personal"
                    refreshTrip={this.refreshTripJSON}
                  />
                  <Expenses
                    travelerId={this.props.traveler.id}
                    travelerIds={this.state.tripData.travelerIds}
                    travelers={this.state.travelers}
                    tripId={this.state.tripData.id}
                    expenseIds={this.state.tripData.expenseIds}
                    refreshTrip={this.refreshTripJSON}
                  />
                </Col>
                <Col md={12} lg={4}>
                  <Travelers
                    id={this.state.tripData.id}
                    tripId={this.state.tripData.id}
                    tripOwner={this.state.tripData.travelerId}
                    travelerId={this.props.traveler.id}
                    travelerIds={this.state.tripData.travelerIds}
                    friendIds={this.props.traveler.friendIds}
                    tripLeaders={this.state.tripData.tripLeaders}
                    refreshTrip={this.refreshTripJSON}
                    isTripLeader={this.isTripLeader}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <Button
                    className="float-left ml-1"
                    onClick={this.openEditTripModal}
                  >
                    Edit Trip
                  </Button>
                  {this.showDeleteTrip()}
                  {this.showLeaveTrip()}
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Trip;
