import React, { Component } from "react";
import { Form, Button, Col, Card, Alert } from "react-bootstrap";
import createTripImage from "../../Media/createTripImage.svg";
import createTripIcon from "../../Media/createTripIcon.svg";
import "../../Stylesheets/CreateTrip.css";

class CreateTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      message: "",
      status: "",
    };
  }

  createTrip = (event) => {
    event.preventDefault();

    const { name, description } = event.target.elements;

    const travelerId = this.getUserId();
    const data = {
      travelerId: travelerId,
      travelerIds: [travelerId],
      tripLeaders: [travelerId],
      name: name.value,
      description: description.value,
    };

    name.value = "";
    description.value = "";

    fetch("trip/createTrip", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json()).then((res) => {
      if (res.status === 200) {
        this.addTravelerToTrip(travelerId, res.tripId);
        this.showAlert("Successfully created Trip!", "success");
      } else {
        this.showAlert("Failed to create Trip.", "danger");
      }
    });
  };

  addTravelerToTrip = (travelerId, tripId) => {
    const data = { travelerId, tripId };
    fetch("/trip/addTraveler", {
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

  showAlert = (message, status) => {
    this.setState({ message, status, visible: true }, () => {
      window.setTimeout(() => {
        this.setState({ visible: false });
      }, 2000);
    });
  };
  resetInputs = (event ) => {
    event.preventDefault();
    const { name, description } = event.target.elements;
    name.value = "";
    description.value = "";
  }

  render() {
    return (
      <div className="w-100 h-100 ">
        <div className="createTrip-page-header">
          <img
            src={createTripIcon}
            width="40"
            height="40"
            className="d-inline-block align-top mr-2"
            alt="createTripIcon"
            id="createTripIcon"
          />
          <h1 className="d-inline-block">
            <strong> Create Trip</strong>
          </h1>
        </div>
        <hr></hr>

        <Card border="secondary" style={{ width: "100%" }}>
          <Card.Header className="createTrip-form-header pb-1 pt-1">
            <h4> Create Trip Form </h4>
          </Card.Header>
          <Card.Body className="createTrip-form-body">
            <Form onSubmit={this.createTrip} onReset={this.resetInputs}>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridname">
                  <Form.Label>
                    <strong>Trip Name</strong>
                  </Form.Label>
                  <Form.Control
                    name="name"
                    type="name"
                    placeholder="Trip Name"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridDescription">
                  <Form.Label>
                    <strong>Description</strong>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    type="description"
                    placeholder="Trip Description"
                  />
                </Form.Group>
              </Form.Row>

              <div style={{ textAlign: "right" }}>
              <Button variant="success" type="submit">
                  Create Trip
                </Button>
                  <Button className="ml-1" variant="warning " type="reset">
                    Reset Form
                  </Button>
              </div>
            </Form>
          </Card.Body>
          <Alert
            className="m-0"
            variant={this.state.status}
            show={this.state.visible}
            style={{ textAlign: "center" }}
          >
            {this.state.message}
          </Alert>
        </Card>
        <img
          src={createTripImage}
          className="page-background-image mr-5"
          alt="navBarImage"
          id="navBarImage"
        />
      </div>
    );
  }
}

export default CreateTrip;
