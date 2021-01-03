import React, { Component } from "react";
import { Card, Col, Row, Tab, ListGroup, Button } from "react-bootstrap";

import AddItem from "./modals/AddItem";
import itemIcon from "../../Media/itemIcon.svg";

import "../../Stylesheets/Items.css";

class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddItem: false,
      showEditItem: false,
      items: [],
      groupItems: [],
      personalItems: [],
      travelers: [],
      itemToEdit: null,
    };

    this.openAddItemModal = this.openAddItemModal.bind(this);
    this.closeAddItemModal = this.closeAddItemModal.bind(this);
    this.openEditItemModal = this.openEditItemModal.bind(this);
    this.closeEditItemModal = this.closeEditItemModal.bind(this);
  }

  closeAddItemModal = () => {
    this.setState({ showAddItem: false });
  };

  openAddItemModal = () => {
    this.setState({ showAddItem: true });
  };

  closeEditItemModal = () => {
    this.setState({ showEditItem: false, itemToEdit: null });
  };

  openEditItemModal = (item) => {
    this.setState({ showEditItem: true, itemToEdit: item });
  };

  getItemsListJSON = (itemIds) => {
    const data = {
      travelerId: this.props.travelerId,
      tripId: this.props.tripId,
      itemIds,
    };
    fetch("/item/getItemsList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({groupItems: res.groupItems, personalItems: res.personalItems});
      });
  };

  // getTravelersJSON = (groupItems, personalItems) => {
  //   fetch("/trip/getTravelers/" + this.props.travelerIds, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       var travelers = {};
  //       for (const traveler of res.travelers) {
  //         travelers[traveler.id] = traveler;
  //       }
  //       this.setState({ travelers, groupItems, personalItems });
  //     });
  // };

  deleteItem = (itemId, tripId) => {
    fetch("/item/deleteItem", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: itemId, tripId }),
    }).then((res) => {
      this.props.refreshTrip();
      this.getItemsListJSON();
    });
  };

  createItemPane = (item) => {
    let assignee;
    let name;
    if (item.assignee) {
      assignee = this.props.travelers[item.assignee];
      name = assignee.firstName + " " + assignee.lastName;
    } else {
      name = "";
    }
    return (
      <Tab.Pane key={item.id} eventKey={`#${item.id}`}>
        <h5>Item Name: {item.name}</h5>
        <h6>Assigned To: {name}</h6>
        <br></br>
        <h6>Description:</h6>
        {item.description}
        <hr></hr>
        <Button
          className="float-right ml-1"
          onClick={() => {
            this.deleteItem(item.id, this.props.tripId);
          }}
          variant="danger"
        >
          Delete
        </Button>
        <Button
          className="float-right"
          onClick={() => {
            this.openEditItemModal(item);
          }}
        >
          Edit
        </Button>
      </Tab.Pane>
    );
  };

  renderItemsTabPane = () => {
    let itemsToRender = [];
    if (this.props.category === "Group") {
      itemsToRender = this.state.groupItems;
    } else {
      itemsToRender = this.state.personalItems;
    }
    if (!itemsToRender || itemsToRender.length === 0) return;
    let itemListPaneJSX = [];
    for (let item of itemsToRender) {
      itemListPaneJSX.push(this.createItemPane(item));
    }
    return itemListPaneJSX;
  };

  createItemListGroupItem = (item) => {
    let completion = item.isComplete ? "✅" : "❌";
    return (
      <ListGroup.Item key={item.id} action href={`#${item.id}`}>
        {item.name}
        <span style={{ float: "right" }}>{completion}</span>
      </ListGroup.Item>
    );
  };

  renderItemsListGroupItem = () => {
    let itemsToRender = [];
    if (this.props.category === "Group") {
      itemsToRender = this.state.groupItems;
    } else {
      itemsToRender = this.state.personalItems;
    }
    if (!itemsToRender || itemsToRender.length === 0) return;
    let itemListGroupItemJSX = [];
    for (let item of itemsToRender) {
      itemListGroupItemJSX.push(this.createItemListGroupItem(item));
    }
    return itemListGroupItemJSX;
  };

  renderItems = () => {
    return (
      <Row>
        <Col sm={5}>
          <ListGroup>{this.renderItemsListGroupItem()}</ListGroup>
        </Col>
        <Col>
          <Tab.Content>{this.renderItemsTabPane()}</Tab.Content>
        </Col>
      </Row>
    );
  };

  refreshItems = () => {
    this.getItemsListJSON(this.props.itemIds);
  };

  componentWillReceiveProps(nextProps) {
    this.getItemsListJSON(nextProps.itemIds);
  }

  componentDidMount() {
    this.getItemsListJSON(this.props.itemIds);
  }

  render() {
    return (
      <div>
        <AddItem
          kind="Add"
          category={this.props.category}
          travelerId={this.props.travelerId}
          travelerIds={this.props.travelerIds}
          travelers={this.props.travelers}
          tripId={this.props.tripId}
          show={this.state.showAddItem}
          refreshTrip={this.props.refreshTrip}
          handleClose={this.closeAddItemModal}
        />

        <AddItem
          kind="Edit"
          category={this.props.category}
          travelerId={this.props.travelerId}
          travelerIds={this.props.travelerIds}
          travelers={this.props.travelers}
          tripId={this.props.tripId}
          show={this.state.showEditItem}
          refreshTrip={this.props.refreshTrip}
          refreshItem={this.refreshItems}
          handleClose={this.closeEditItemModal}
          item={this.state.itemToEdit}
        />

        <Card className="item-list mb-3">
          <Card.Header className="item-list-header p-1 pl-3">
            <img
              src={itemIcon}
              width="25"
              height="25"
              className="item-list-icon d-inline-block align-top mr-2 "
              alt="itemIcon"
              id="itemIcon"
            />
            <strong>{this.props.category} List</strong>
            <Button
              className="ml-auto d-inline-block"
              variant="success"
              onClick={this.openAddItemModal}
            >
              📋 Add
            </Button>
          </Card.Header>
          <Card.Body className="item-list-body">
            <Tab.Container
              id="list-group-tabs-example"
              defaultActiveKey="#link1"
              transition={false}
            >
              {this.renderItems()}
            </Tab.Container>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Items;
