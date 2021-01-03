import React, { Component } from "react";
import { Card, ListGroup } from "react-bootstrap";
import "../../Stylesheets/Account.css";
import editIcon from "../../Media/accountEditIcon.svg";
import EditName from "./modals/EditName";
import EditUsername from "./modals/EditUsername";
import accountIcon from "../../Media/accountIcon.svg";
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditName: false,
      showEditUsername: false,
    };
    this.openEditNameModal = this.openEditNameModal.bind(this);
    this.closeEditNameModal = this.closeEditNameModal.bind(this);
    this.openEditUsernameModal = this.openEditUsernameModal.bind(this);
    this.closeEditUsernameModal = this.closeEditUsernameModal.bind(this);
  }

  // Edit Name Modal
  closeEditNameModal = () => {
    this.setState({ showEditName: false });
  };
  openEditNameModal = () => {
    this.setState({ showEditName: true });
  };
  // Edit Username Modal
  closeEditUsernameModal = () => {
    this.setState({showEditUsername: false});
  }
  openEditUsernameModal = () => {
    this.setState({showEditUsername: true});
  }

  // Parse Miliseconds to Date string
  getDateCreatedOn() {
    return new Date(parseInt(this.props.traveler.createdOn,10)).toString('MM/dd/yy HH:mm:ss');
  }
  render() {
    return (
        <div className="accountInfo w-100 h-100">
          <EditName
          traveler={this.props.traveler}
          show={this.state.showEditName}
          refreshTraveler={this.props.refreshTraveler}
          handleClose={this.closeEditNameModal}
          />
          <EditUsername
          traveler={this.props.traveler}
          show={this.state.showEditUsername}
          refreshTraveler={this.props.refreshTraveler}
          handleClose={this.closeEditUsernameModal}
          centered
          />
          <div className="account-page-header">
          <img
            src={accountIcon}
            width="40"
            height="40"
            className="d-inline-block align-top mr-2"
            alt="accountIcon"
            id="accountIcon"
          />
          <h1 className="d-inline-block">
            <strong> General Account Settings</strong>
          </h1>
        </div>
        <hr></hr>
          <Card style={{ width: "100%" }}>
            <Card.Body>
              <ListGroup variant="flush" className="settingsList">
                <ListGroup.Item
                  className="settingsListItem pt-2 pb-2"
                  action
                  onClick={() => this.openEditNameModal()}
                >
                  <strong>Name</strong>
                  <p className="m-0">{this.props.traveler.firstName + " " + this.props.traveler.lastName}</p>
                  <div>
                    <img
                      src={editIcon}
                      width="24"
                      height="24"
                      className="align-top mr-2 editIcon"
                      alt="editIcon"
                      id="editIcon"
                    />
                    <p className="d-inline-block m-0"> EDIT </p>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  className="settingsListItem pt-2 pb-2"
                  action
                  onClick={() => this.openEditUsernameModal()}
                >
                  <strong>Username</strong>
                  <p className="m-0"> {this.props.traveler.username}</p>
                  <div>
                    <img
                      src={editIcon}
                      width="24"
                      height="24"
                      className="align-top mr-2 editIcon"
                      alt="editIcon"
                      id="editIcon"
                    />
                    <p className="d-inline-block m-0"> EDIT </p>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  className="settingsListItem pt-2 pb-2"
                  disabled
                >
                  <strong>Email</strong>
                  <p className="m-0">{this.props.traveler.email}</p>
                  <div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  className="settingsListItem pt-2 pb-2"
                  disabled
                >
                  <strong>Account Creation Date</strong>
                  <p className="m-0">{this.getDateCreatedOn()}</p>
                  <div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
    );
  }
}

export default Account;
