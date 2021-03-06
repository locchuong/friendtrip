import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

import AddDestination from "./AddDestination";

class ViewDestination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddDestination: false,
    };

    this.openAddDestinationModal = this.openAddDestinationModal.bind(this);
    this.closeAddDestinationModal = this.closeAddDestinationModal.bind(this);
  }

  closeAddDestinationModal = () => {
    this.setState({ showAddDestination: false });
  };

  openAddDestinationModal = () => {
    this.props.handleClose();
    this.setState({ showAddDestination: true });
  };
  deleteDestination = (destinationId, tripId) => {
    fetch("/destination/deleteDestination", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: destinationId, tripId }),
    }).then((res) => {
      this.props.refreshTrip(this.props.refreshDestinations);
      this.props.handleClose();
    });
  };
  render() {
    if (!this.props.destinationToView) return <div></div>;
    return (
      <div>
        <AddDestination
          kind="Edit"
          tripId={this.props.tripId}
          travelerId={this.props.travelerId}
          refreshTrip={this.props.refreshTrip}
          refreshDestinations={this.props.refreshDestinations}
          show={this.state.showAddDestination}
          destinationToEdit={this.props.destinationToView}
          handleClose={this.closeAddDestinationModal}
        ></AddDestination>
        <Modal
          show={this.props.show}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          onHide={this.props.handleClose}
          animation={false}
          centered
        >
          <Modal.Header>
            <Modal.Title>Destination Name: {this.props.destinationToView.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>
              <strong>Description:</strong>
            </h5>
            {this.props.destinationToView.description}
            <br></br>
            <br></br>
            <h5>
              <strong>Duration:</strong>
            </h5>
            {this.props.destinationToView.startDate} to{" "}
            {this.props.destinationToView.endDate}
            <br></br>
            <br></br>
            <h5>
              <strong>Address:</strong>
            </h5>
            {this.props.destinationToView.address}
            <br></br>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.openAddDestinationModal}>Edit</Button>
            <Button
              onClick={() =>
                this.deleteDestination(
                  this.props.destinationToView.id,
                  this.props.tripId
                )
              }
              variant="danger"
            >
              Delete
            </Button>
            <Button onClick={this.props.handleClose} variant="warning">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ViewDestination;
