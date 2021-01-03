var express = require("express");
const {
  getDestination,
  getDestinationList,
  addDestination,
  deleteDestination,
  updateDestination,
  generateDestinationJSON,
} = require("../db/models/destination");
const { getTrip, addTrip, updateTrip } = require("../db/models/trip");
var router = express.Router();

router.get("/getDestination", function (req, res, next) {
  res.send("Not Implemented!");
});

router.get("/getDestinations/:destinationIds", function (req, res, next) {
  const destinationIds = req.params.destinationIds.split(',');
  let handleGetDestinationList = (destinations) => {
    res.json({ destinations });
  };
  getDestinationList(destinationIds, handleGetDestinationList);
});

router.post("/addDestination", function (req, res, next) {
  // Generates random ID
  function generateId(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  // Generate destination ID
  const id = "destination_".concat(
    generateId(
      16,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    )
  );
  const data = generateDestinationJSON(
    id,
    req.body.tripId,
    req.body.travelerId,
    req.body.destName,
    req.body.destCountryCode,
    req.body.destStartDate,
    req.body.destEndDate,
    req.body.destDescription,
    req.body.destAddress
  );
  // Add Destination Object
  let handleAddDestination = (error) => {};
  addDestination(data, handleAddDestination);

  let handleUpdateTrip = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };
  let handleGetTrip = (trip) => {
    if (trip) {
      let newDestinationIds = [];
      if (trip.destinationIds) newDestinationIds = trip.destinationIds;
      newDestinationIds.push(id);
      trip.destinationIds = newDestinationIds;
      updateTrip(trip, handleUpdateTrip);
    }
  };
  getTrip(req.body.tripId, handleGetTrip);
});

router.put("/editDestination", function (req, res, next) {
  let handleGetDestination = (destination) => {
    const data = generateDestinationJSON(
      req.body.id,
      req.body.tripId,
      req.body.travelerId,
      req.body.destName,
      req.body.destCountryCode,
      req.body.destStartDate,
      req.body.destEndDate,
      req.body.destDescription,
      req.body.destAddress,
    );

    updateDestination(data, handleUpdateDestination);
  }

  let handleUpdateDestination = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  }
  
  getDestination(req.body.id, handleGetDestination);
});

router.delete("/deleteDestination", function (req, res, next) {
  let handleDeleteDestination = (error) => {
    getTrip(req.body.tripId, handleGetTrip);
  }

  let handleGetTrip = (trip) => {
    let destinationIds = [];
    for (const destination of trip.destinationIds) {
      if (destination !== req.body.id) destinationIds.push(destination);
    }
    trip.destinationIds = destinationIds;
    updateTrip(trip, handleUpdateTrip);
  }

  let handleUpdateTrip = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  }
  
  deleteDestination(req.body.id, handleDeleteDestination);
});

module.exports = router;
