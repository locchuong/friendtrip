import React, { Component } from "react";
import { Button, Modal, Form, Col } from "react-bootstrap";

class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      travelers: [],
    };
  }

  addItem = (event) => {
    event.preventDefault();
    const { name, description, complete, traveler } = event.target.elements;
    let isPublic = this.props.category === "Group" ? true : false;
    let assignedTraveler = !isPublic ? this.props.travelerId : traveler.value;
    const data = {
      id: this.defaultValue("id"),
      itemName: name.value,
      itemDescription: description.value,
      isPublic: isPublic,
      isComplete: complete.checked,
      assignedTraveler: assignedTraveler,
      travelerId: this.props.travelerId,
      tripId: this.props.tripId,
    };
    const addItemAPI = "/item/addItem";
    const editItemAPI = "/item/editItem";
    const fetchAPI = this.props.kind === "Add" ? addItemAPI : editItemAPI;

    fetch(fetchAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      this.props.refreshTrip(this.props.refreshItem);
      this.props.handleClose();
    });
  };

  // Create Traveler Radio
  createTraveler = (travelerId, travelerName) => {
    const checked = travelerId === this.defaultValue("assignee");
    return (
      <Form.Check
        custom
        type="radio"
        name="traveler"
        label={travelerName}
        id={`#${travelerId}`}
        key={travelerId}
        value={travelerId}
        defaultChecked={checked}
      />
    );
  };

  // Render Traveler(s) Radio
  renderTravelers = () => {
    if (!this.props.travelers || this.props.travelerIds.length === 0) return;
    var travelersJSX = [];
    for (const traveler in this.props.travelers) {
      travelersJSX.push(this.createTraveler(traveler, this.props.travelers[traveler]));
    }
    return travelersJSX;
  };

  defaultValue = (param) => {
    if (!this.props.item) return "";
    else return this.props.item[param];
  };

  renderTravelersOnCategory = () => {
    if (this.props.category === "Personal") return;
    else {
      return (
        <div>
          <h5>Choose Traveler to Assign</h5>
          <Form.Row className="m-0 p-0">
            <br></br>
            <div key="assignedTraveler">{this.renderTravelers()}</div>
          </Form.Row>
        </div>
      );
    }
  };

  render() {
    const isCheckedOff = this.defaultValue("isComplete");
    return (
      <Modal
        show={this.props.show}
        dialogClassName="modal-60w"
        aria-labelledby="contained-modal-title-vcenter"
        onHide={this.props.handleClose}
        animation={false}
        centered
      >
        <Form onSubmit={this.addItem} className="p-3">
          <Modal.Body>
            <h4>
              {this.props.kind} {this.props.category} Item
            </h4>
            <Form.Row className="m-0 p-0">
              <Form.Group
                as={Col}
                className="m-0 p-0"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  defaultValue={this.defaultValue("name")}
                  name="name"
                  as="textarea"
                  rows={1}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row className="m-0 p-0">
              <Form.Group
                as={Col}
                className="m-0 p-0"
                controlId="exampleForm.ControlTextarea2"
              >
                <Form.Label>Item Description</Form.Label>
                <Form.Control
                  defaultValue={this.defaultValue("description")}
                  name="description"
                  as="textarea"
                  rows={4}
                />
              </Form.Group>
            </Form.Row>
            <br></br>
            <Form.Row className="m-0 p-0">
              <Form.Check
                custom
                type="checkbox"
                name="complete"
                label="Completion Check-off"
                id="complete"
                defaultChecked={isCheckedOff}
              />
            </Form.Row>
            <br></br>
            {this.renderTravelersOnCategory()}
          </Modal.Body>
          <Modal.Footer>
            <Button className="m-0" variant="success" type="submit">
              Save
            </Button>
            <Button
              className="m-0 ml-1"
              variant="warning"
              onClick={this.props.handleClose}
            >
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default AddItem;
