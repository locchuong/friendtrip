var express = require("express");
const {
  Expense,
  generateExpenseJSON,
  updateExpense,
  addExpense,
  getExpenseList,
  deleteExpense,
  getExpense,
} = require("../db/models/expense");
const { updateTrip, getTrip } = require("../db/models/trip");
var router = express.Router();

router.post("/getExpense", function (req, res, next) {
  res.send("Not Implemented!");
});

router.get("/getExpenses/:expenseIds", function (req, res, next) {
    const expenseIds = req.params.expenseIds.split(',');
    let handleGetExpenses = (expenses) => {
      res.json({ expenses });
    };
    getExpenseList(expenseIds, handleGetExpenses);
});

router.post("/addExpense", function (req, res, next) {
  // Generates random ID
  function generateId(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  // Generate item ID
  const id = "expense_".concat(
    generateId(
      16,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    )
  );
  const data = generateExpenseJSON(
    id,
    req.body.tripId,
    req.body.travelerId,
    req.body.expenseName,
    req.body.description,
    req.body.cost,
    req.body.assignedTravelers
  );
  // Add expense to database
  let handleAddExpense = (error) => {};
  addExpense(data, handleAddExpense);
  // Add expense to Trip Object
  let handleUpdateTrip = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };
  let handleGetTrip = (trip) => {
    if (trip) {
      let newExpenseIds = [];
      if (trip.expenseIds) newExpenseIds = trip.expenseIds;
      newExpenseIds.push(id);
      trip.expenseIds = newExpenseIds;
      updateTrip(trip, handleUpdateTrip);
    }
  };
  getTrip(req.body.tripId, handleGetTrip);
});

router.post("/editExpense", function (req, res, next) {
  let handleGetExpense = (expense) => {
    const data = generateExpenseJSON(
      req.body.id,
      req.body.tripId,
      req.body.travelerId,
      req.body.expenseName,
      req.body.description,
      req.body.cost,
      req.body.assignedTravelers
    );
    updateExpense(data, handleUpdateExpense);
  };
  let handleUpdateExpense = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };
  getExpense(req.body.id, handleGetExpense);
});

router.delete("/deleteExpense", function (req, res, next) {
  let handleDeleteExpense = (error) => {
    getTrip(req.body.tripId, handleGetTrip);
  };
  let handleGetTrip = (trip) => {
    let expenseIds = [];
    for (const expense of trip.expenseIds) {
      if (expense !== req.body.id) expenseIds.push(expense);
    }
    trip.expenseIds = expenseIds;
    updateTrip(trip, handleUpdateTrip);
  };
  let handleUpdateTrip = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };
  deleteExpense(req.body.id, handleDeleteExpense);
});

module.exports = router;
