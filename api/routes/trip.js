var express = require("express");
const {
  getTraveler,
  getTravelerList,
  updateTraveler,
} = require("../db/models/traveler");
const {
  getTripList,
  getTrip,
  updateTrip,
  deleteTrip,
  addTrip,
  generateTripJSON,
} = require("../db/models/trip");
const { deleteItem, getItemList, updateItem } = require("../db/models/item");
const {
  getExpenseList,
  deleteExpense,
  updateExpense,
} = require("../db/models/expense");
const {
  getDestinationList,
  deleteDestination,
} = require("../db/models/destination");
var router = express.Router();



router.put('/createTrip', function (req, res, next) {
  function generateId(length, chars) {
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
  }

  const id = ("trip_").concat(generateId(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'));
  const data = generateTripJSON(id, req.body.travelerId, req.body.name, Date.now(),
                                req.body.travelerIds, [], [], [], req.body.description, 
                                "", req.body.tripLeaders);

  let handleAddTrip = (error) => {
    var status;
    if (error) status = 401;
    else status = 200;
    res.json({ status, tripId: id });
  }

  addTrip(data, handleAddTrip);
});

router.get("/getTrip/:tripId", function (req, res, next) {
  let handleGetTrip = (trip) => {
    res.json({ trip });
  };

  getTrip(req.params.tripId, handleGetTrip);
});

router.get("/getTrips/:tripIds", function (req, res, next) {
  const tripIds = req.params.tripIds.split(',');
  let handleGetTrips = (trips) => {
    res.json({ trips });
  };
  getTripList(tripIds, handleGetTrips);
});

router.get("/getTravelers/:travelerIds", function (req, res, next) {
  const travelerIds = req.params.travelerIds.split(',');
  let handleGetTravelers = (travelers) => {
    res.json({ travelers });
  };
  getTravelerList(travelerIds, handleGetTravelers);
});

router.put("/addTraveler", function (req, res, next) {
  let handleGetTraveler = (traveler) => {
    if (!traveler.tripIds) traveler.tripIds = [];
    traveler.tripIds.push(req.body.tripId);

    updateTraveler(traveler, handleUpdateTraveler);
  };

  let handleUpdateTraveler = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };

  getTraveler(req.body.travelerId, handleGetTraveler);
});

router.put("/updateItinerary", function (req, res, next) {
  let handleUpdateItinerary = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };

  updateTrip(req.body, handleUpdateItinerary);
});

router.put("/updateTrip", function (req, res, next) {
  let handleUpdateTrip = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };

  updateTrip(req.body, handleUpdateTrip);
});

router.put("/sendInvite", function (req, res, next) {
  let handleGetTraveler = (traveler) => {
    if (!traveler.invitations) traveler.invitations = [];

    // Don't give a Traveler multiple of the same invite.
    for (const invite of traveler.invitations) {
      if (invite === req.body.tripId) {
        res.sendStatus(202);
        return;
      }
    }

    traveler.invitations.push(req.body.tripId);
    updateTraveler(traveler, handleUpdateTraveler);
  };

  let handleUpdateTraveler = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };

  getTraveler(req.body.id, handleGetTraveler);
});

router.post("/addTripLeader", function (req, res, next) {
  let handleUpdateTrip = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };
  updateTrip(req.body, handleUpdateTrip);
});

router.delete("/deleteTrip", function (req, res, next) {
  let handleGetTraveler = (travelerList) => {
    let travelerListLength = Object.keys(travelerList).length;
    for (let i = 0; i < travelerListLength; i++) {
      let trips;
      let tripsLength;
      // Delete the Trip id from every Traveler on the Trip
      if (travelerList[i].tripIds) {
        trips = travelerList[i].tripIds;
        tripsLength = Object.keys(trips).length;
        // For each trip they are on, look for the trip to delete and delete it
        var newTrips = [];
        for (let j = 0; j < tripsLength; j++) {
          if (req.body.tripId !== trips[j]) {
            newTrips.push(trips[j]);
          }
        }
        // Copy the trips array with the trip deleted to the traveler
        travelerList[i].tripIds = newTrips;
        updateTraveler(travelerList[i], handleUpdateTraveler);
      }
      // Delete the Item objects associated with the Trip
      getItemList(req.body.itemIds, handleGetItems);
      // Delete the Expense Objects associated with the Trip
      getExpenseList(req.body.expenseIds, handleGetExpenses);
      // Delete the Destination objects associated with the Trip
      getDestinationList(req.body.destinationIds, handleGetDestinations);
    }
    deleteTrip(req.body.tripId, handleDeleteTrip);
  };
  // Destination Callbacks
  let handleGetDestinations = (destinations) => {
    let destinationsListLength = Object.keys(destinations).length;
    for (let l = 0; l < destinationsListLength; l++) {
      deleteDestination(destinations[l].id, handleDeleteDestination);
    }
  };
  let handleDeleteDestination = (error) => {};
  // Item Callbacks
  let handleGetItems = (items) => {
    let itemsListLength = Object.keys(items).length;
    for (let k = 0; k < itemsListLength; k++) {
      deleteItem(items[k].id, handleDeleteItem);
    }
  };
  let handleDeleteItem = (error) => {};
  // Expense Callbacks
  let handleGetExpenses = (expenses) => {
    let expensesListLength = Object.keys(expenses).length;
    for (let m = 0; m < expensesListLength; m++) {
      deleteExpense(expenses[m].id, handleDeleteExpense);
    }
  };
  let handleDeleteExpense = (error) => {};
  // Travler Callback
  let handleUpdateTraveler = (error) => {};
  // Trip Callback
  let handleDeleteTrip = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };
  // Get the travelers
  getTravelerList(req.body.travelerIds, handleGetTraveler);
});

router.put("/leaveTrip", function (req, res, next) {
  // For a Traveler Object, remove the trip from their tripIds
  let handleGetTraveler = (traveler) => {
    let trips;
    let tripsLength;
    if (traveler.tripIds) {
      trips = traveler.tripIds;
      tripsLength = Object.keys(trips).length;
      let newTrips = [];
      for (let i = 0; i < tripsLength; i++) {
        if (trips[i] !== req.body.tripId) newTrips.push(trips[i]);
      }
      traveler.tripIds = newTrips;
      updateTraveler(traveler, handleUpdateTraveler);
    }
  };
  let handleUpdateTraveler = (error) => {};
  getTraveler(req.body.travelerId, handleGetTraveler);

  // For a Trip Object, remove the traveler from travelerIds and from tripLeaders (if trip leader)
  let handleGetTrip = (trip) => {
    // Handle removing traveler from Trip Object's travelerIds
    let travelerIds;
    let travelerIdsLength;
    let newTravelerIds = [];
    if (trip.travelerIds) {
      travelerIds = trip.travelerIds;
      travelerIdsLength = Object.keys(travelerIds).length;
      for (let j = 0; j < travelerIdsLength; j++) {
        if (req.body.travelerId !== travelerIds[j])
          newTravelerIds.push(travelerIds[j]);
      }
      trip.travelerIds = newTravelerIds;
    }
    // Handle removing Trip Leader from Trip Object's trip leaders
    let tripLeaders;
    let tripLeadersLength;
    let newTripLeaders = [];
    if (req.body.isTripLeader && trip.tripLeaders) {
      tripLeaders = trip.tripLeaders;
      tripLeadersLength = Object.keys(tripLeaders).length;
      for (let k = 0; k < tripLeadersLength; k++) {
        if (req.body.travelerId !== tripLeaders[k])
          newTripLeaders.push(tripLeaders[k]);
      }
      trip.tripLeaders = newTripLeaders;
    }
    // Handle updating the Item Objects in the abscence of the Traveler
    if (trip.itemIds) getItemList(trip.itemIds, handleGetItems);
    // Handle updating the Expense in the abscence of the Traveler
    if (trip.expenseIds) getExpenseList(trip.expenseIds, handleGetExpenses);
    // Update the Trip Object
    updateTrip(trip, handleUpdateTrip);
  };
  let handleGetExpenses = (expenses) => {
    if (expenses) {
      let expensesListLength = Object.keys(expenses).length;
      for (let n = 0; n < expensesListLength; n++) {
        let newExpenseAssignees = [];
        let expenseAssigneesLength = Object.keys(expenses[n].travelerIds)
          .length;
        for (let t = 0; t < expenseAssigneesLength; t++) {
          if (expenses[n].travelerIds[t] !== req.body.travelerId)
            newExpenseAssignees.push(expenses[n].travelerIds[t]);
        }
        expenses[n].travelerIds = newExpenseAssignees;
        updateExpense(expenses[n], handleUpdateExpense);
      }
    }
  };
  let handleUpdateExpense = (error) => {};
  // For each item in the Trip, if the person leaving is assigned to it, blank out the assignee
  let handleGetItems = (items) => {
    if (items) {
      let itemsListLength = Object.keys(items).length;
      for (let l = 0; l < itemsListLength; l++) {
        // Remove Traveler from Group Item (Leave Personal Items alone)
        if (items[l].isPublic && items[l].assignee === req.body.travelerId) {
          let newItem = items[l];
          newItem.assignee = null;
          updateItem(newItem, handleUpdateItem);
        }
      }
    }
  };
  let handleDeleteItem = (error) => {};
  let handleUpdateItem = (error) => {};
  let handleUpdateTrip = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };
  getTrip(req.body.tripId, handleGetTrip);
});

router.post("/alertTraveler", function (req, res, next) {
  res.send("Not Implemented!");
});

router.put("/acceptInvite", function (req, res, next) {
  // Get Traveler
  let handleGetTraveler = (traveler) => {
    // Remove invitation
    var invitations = [];
    if (traveler.invitations) {
      for (const invite of traveler.invitations) {
        if (invite !== req.body.tripId) invitations.push(invite);
      }
    }

    // Add Trip
    var tripIds = [];
    if (traveler.tripIds) tripIds = traveler.tripIds;
    tripIds.push(req.body.tripId);

    // Callback
    const data = { id: req.body.travelerId, invitations, tripIds };
    updateTraveler(data, handleUpdateTraveler);
  };

  let handleUpdateTraveler = (error) => {};

  let handleGetTrip = (trip) => {
    // Add Traveler
    var travelerIds = trip.travelerIds;
    travelerIds.push(req.body.travelerId);

    // Callback
    const data = { id: req.body.tripId, travelerIds };
    updateTrip(data, handleUpdateTrip);
  };

  let handleUpdateTrip = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };

  // Add Trip to Traveler, add Traveler to Trip
  getTraveler(req.body.travelerId, handleGetTraveler);
  getTrip(req.body.tripId, handleGetTrip);
});

router.put("/rejectInvite", function (req, res, next) {
  let handleGetTraveler = (traveler) => {
    var invitations = [];
    if (traveler.invitations) {
      for (const invite of traveler.invitations) {
        if (invite !== req.body.tripId) invitations.push(invite);
      }
    }

    const data = { id: req.body.travelerId, invitations };
    updateTraveler(data, handleUpdateTraveler);
  };

  let handleUpdateTraveler = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };

  getTraveler(req.body.travelerId, handleGetTraveler);
});

module.exports = router;
