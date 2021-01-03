import React, { Component } from "react";
import { Button, Modal, Form, Col } from "react-bootstrap";

class AddExpense extends Component {
  
  // Handles add/edit Expense api call
  addExpense = (event) => {
    event.preventDefault();
    // Grab values from user inputs (in modal box)
    const { name, description, cost, traveler } = event.target.elements;
    // Determine which travelers are assigned the expense
    let assignedTravelers = [];
    if (this.props.travelerIds.length === 1) {
      if (traveler.checked) assignedTravelers.push(traveler.value);
    } else if (this.props.travelerIds.length > 1) {
      for (let i = 0; i < this.props.travelerIds.length; i++) {
        if (traveler[i].checked) assignedTravelers.push(traveler[i].value);
      }
    }
    const data = {
      id: this.defaultValue("id"),
      expenseName: name.value,
      description: description.value,
      cost: cost.value,
      travelerId: this.props.travelerId,
      tripId: this.props.tripId,
      assignedTravelers: assignedTravelers,
    };
    const addExpenseAPI = "/expense/addExpense";
    const editExpenseAPI = "/expense/editExpense";
    const fetchAPI = this.props.kind === "Add" ? addExpenseAPI : editExpenseAPI;
    fetch(fetchAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      this.props.refreshTrip(this.props.refreshExpense);
      this.props.handleClose();
    });
  }

  travelerAssigned = (travelerId, ids) => {
    ids = Object.values(ids);
    for (const assignee of ids) {
      if (assignee === travelerId) return true;
    }
    return false;
  };

  // Create Traveler Radio
  createTraveler = (travelerId, travelerName) => {
    var checked = false;
    if (this.props.expense && this.props.expense.travelerIds) {
      checked = this.travelerAssigned(
        travelerId,
        this.props.expense.travelerIds
      );
    }
    return (
      <Form.Check
        custom
        type="checkbox"
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
      travelersJSX.push(
        this.createTraveler(traveler, this.props.travelers[traveler])
      );
    }

    return travelersJSX;
  };

  defaultValue = (param) => {
    if (!this.props.expense) return null;
    else return this.props.expense[param];
  };

  render() {
    return (
      <Modal
        show={this.props.show}
        dialogClassName="modal-60w"
        aria-labelledby="contained-modal-title-vcenter"
        onHide={this.props.handleClose}
        animation={false}
        centered
      >
        <Form onSubmit={this.addExpense} className="p-3">
          <Modal.Body>
            <h4>{this.props.kind} Expense</h4>
            <h5>Split a cost equally amongst Travelers</h5>
            <Form.Row>
              <Form.Group as={Col} controlId="exampleForm.ControlTextarea1">
                <Form.Label>Expense Name</Form.Label>
                <Form.Control
                  defaultValue={this.defaultValue("name")}
                  name="name"
                  as="textarea"
                  rows={1}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="exampleForm.ControlTextarea2">
                <Form.Label>Expense Description</Form.Label>
                <Form.Control
                  defaultValue={this.defaultValue("description")}
                  name="description"
                  as="textarea"
                  rows={4}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="exampleForm.ControlTextarea3">
                <Form.Label>Cost</Form.Label>
                <Form.Control
                  defaultValue={this.defaultValue("cost")}
                  name="cost"
                  as="textarea"
                  rows={1}
                />
              </Form.Group>
            </Form.Row>
            <br></br>

            <h5>Choose Travelers to Assign</h5>

            <Form.Row>
              <br></br>
              <div key="assignedTraveler">{this.renderTravelers()}</div>
            </Form.Row>
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

export default AddExpense;
