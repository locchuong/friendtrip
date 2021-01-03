import React, { Component } from "react";
import { Card, Col, Row, Tab, ListGroup, Button } from "react-bootstrap";

import AddExpense from "./modals/AddExpense";
import "../../Stylesheets/Expenses.css";
import expenseIcon from "../../Media/expenseIcon.svg";

class Expenses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddExpense: false,
      expenses: [],
      expenseToEdit: null,
    };

    this.openAddExpenseModal = this.openAddExpenseModal.bind(this);
    this.closeAddExpenseModal = this.closeAddExpenseModal.bind(this);
    this.closeEditExpenseModal = this.closeEditExpenseModal.bind(this);
    this.openEditExpenseModal = this.openEditExpenseModal.bind(this);
  }

  closeAddExpenseModal = () => {
    this.setState({ showAddExpense: false });
  };

  openAddExpenseModal = () => {
    this.setState({ showAddExpense: true });
  };

  closeEditExpenseModal = () => {
    this.setState({ showEditExpense: false, expenseToEdit: null });
  };

  openEditExpenseModal = (item) => {
    this.setState({ showEditExpense: true, expenseToEdit: item });
  };

  getExpenses = (expenseIds) => {
    if (expenseIds) {
      fetch("/expense/getExpenses/" + expenseIds, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          this.setState({expenses: res.expenses});
        });
    } else {
      this.setState({expenses: [] });
    }
  };

  createExpenseListGroupItem = (expense) => {
    return (
      <ListGroup.Item action key={`#${expense.id}`} href={`#${expense.id}`}>
        {expense.name}
      </ListGroup.Item>
    );
  };

  deleteExpense = (expenseId, tripId) => {
    fetch("/expense/deleteExpense", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: expenseId, tripId }),
    }).then((res) => {
      this.props.refreshTrip(this.refreshExpenses);
    });
  };

  createExpenseTabPane = (expense) => {
    let travelerList = [];
    if (expense.travelerIds) {
      for (let i = 0; i < Object.keys(expense.travelerIds).length; i++) {
        travelerList.push(
          <li key={`#${expense.travelerIds[i]}`}>
            {this.props.travelers[expense.travelerIds[i]]}{" "}
          </li>
        );
      }
    }
    return (
      <Tab.Pane key={`#${expense.id}`} eventKey={`#${expense.id}`}>
        <h5>{expense.name}</h5>
        <h6>Remaining Balance: {expense.cost}</h6>
        <h6>Travelers: </h6>
        {travelerList}
        <br />
        <h6>Description:</h6>
        <p>{expense.description}</p>
        <hr></hr>
        <Button
          className="float-right ml-1"
          onClick={() => {
            this.deleteExpense(expense.id, this.props.tripId);
          }}
          variant="danger"
        >
          Delete
        </Button>
        <Button
          className="float-right"
          onClick={() => {
            this.openEditExpenseModal(expense);
          }}
        >
          Edit
        </Button>
      </Tab.Pane>
    );
  };

  renderExpenseListGroupItem = () => {
    if (!this.state.expenses || this.state.expenses.length === 0) return;
    let expenseListGroupItemJSX = [];
    for (let expense of this.state.expenses) {
      expenseListGroupItemJSX.push(this.createExpenseListGroupItem(expense));
    }
    return expenseListGroupItemJSX;
  };

  renderExpenseTabPane = () => {
    if (!this.state.expenses || this.state.expenses.length === 0) return;
    let expenseTabPaneJSX = [];
    for (let expense of this.state.expenses) {
      expenseTabPaneJSX.push(this.createExpenseTabPane(expense));
    }
    return expenseTabPaneJSX;
  };

  renderExpenses = () => {
    if (!this.state.expenses || this.state.expenses.length === 0) return;
    return (
      <Row>
        <Col sm={5}>
          <ListGroup>{this.renderExpenseListGroupItem()}</ListGroup>
        </Col>
        <Col>
          <Tab.Content>{this.renderExpenseTabPane()}</Tab.Content>
        </Col>
      </Row>
    );
  };

  refreshExpenses = () => {
    this.getExpenses(this.props.expenseIds);
  };

  componentDidMount() {
    this.getExpenses(this.props.expenseIds);
  }

  render() {
    return (
      <div>
        <AddExpense
          kind="Add"
          travelerId={this.props.travelerId}
          travelerIds={this.props.travelerIds}
          travelers={this.props.travelers}
          tripId={this.props.tripId}
          refreshTrip={this.props.refreshTrip}
          refreshExpense={this.refreshExpenses}
          show={this.state.showAddExpense}
          handleClose={this.closeAddExpenseModal}
        ></AddExpense>
        <AddExpense
          kind="Edit"
          travelerId={this.props.travelerId}
          travelerIds={this.props.travelerIds}
          travelers={this.props.travelers}
          tripId={this.props.tripId}
          refreshTrip={this.props.refreshTrip}
          refreshExpense={this.refreshExpenses}
          show={this.state.showEditExpense}
          handleClose={this.closeEditExpenseModal}
          expense={this.state.expenseToEdit}
        />
        <Card className="expenses-list mb-3">
          <Card.Header className="expenses-list-header p-1 pl-3">
            <img
              src={expenseIcon}
              width="25"
              height="25"
              className="expenses-list-icon d-inline-block align-top mr-2 "
              alt="expenseIcon"
              id="expenseIcon"
            />
            <strong>Expenses</strong>
            <Button
              className="ml-auto d-inline-block"
              variant="success"
              onClick={this.openAddExpenseModal}
            >
              📋 Add
            </Button>
          </Card.Header>
          <Card.Body className="expenses-list-body">
            <Tab.Container
              id="list-group-tabs-example"
              defaultActiveKey="#link1"
              transition={false}
            >
              {this.renderExpenses()}
            </Tab.Container>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Expenses;
