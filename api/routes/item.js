var express = require("express");
const { Item, updateItem, getItemList, getItem, deleteItem } = require("../db/models/item");
var router = express.Router();
const { addItem, generateItemJSON } = require("../db/models/item");
const { getTrip, addTrip, updateTrip } = require("../db/models/trip");

// Shouldn't need to specify Personal and Group Items,
// the database doesn't care, the boolean only determines whether or not
// the data is shown.

router.post("/getItem", function (req, res, next) {

 res.send("Not Implemented!");
});

router.post("/getItemsList", function (req, res, next) {
  let handleGetItems = (items) => {
    let personalItems = [];
    let groupItems = [];
    let itemsLength = Object.keys(items).length;
    for (let i = 0; i < itemsLength; i++) {
      if (!items[i].isPublic && items[i].assignee === req.body.travelerId) {
        personalItems.push(items[i]);
      }
      else if (items[i].isPublic) {
        groupItems.push(items[i]);
      }
    }
    res.json({ personalItems, groupItems });
  };
  getItemList(req.body.itemIds, handleGetItems);
});

router.post("/addItem", function (req, res, next) {
  // Generates random ID
  function generateId(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
  // Generate item ID
  const id = "item_".concat(
    generateId(
      16,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    )
  );
  
  // Generate item JSON
  const data = generateItemJSON(
    id,
    req.body.tripId,
    req.body.travelerId,
    req.body.itemName,
    req.body.assignedTraveler,
    req.body.itemDescription,
    req.body.isPublic,
    req.body.isComplete,
  );
  // Add item to database
  let handleAddItem = (error) => {};
  addItem(data, handleAddItem);
  // Add item to Trip Object
  let handleUpdateTrip = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };
  let handleGetTrip = (trip) => {
    if (trip) {
      let newItemIds = [];
      if (trip.itemIds) newItemIds = trip.itemIds;
      newItemIds.push(id);
      trip.itemIds = newItemIds;
      updateTrip(trip, handleUpdateTrip);
    }
  };
  getTrip(req.body.tripId, handleGetTrip);
});

router.post("/editItem", function (req, res, next) {
  let handleGetItem = (item) => {
    const data = generateItemJSON(
      req.body.id,
      req.body.tripId,
      req.body.travelerId,
      req.body.itemName,
      req.body.assignedTraveler,
      req.body.itemDescription,
      req.body.isPublic,
      req.body.isComplete,
    );

    updateItem(data, handleUpdateItem);
  }

  let handleUpdateItem = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  }
  
  getItem(req.body.id, handleGetItem);
});

router.delete("/deleteItem", function (req, res, next) {
  let handleDeleteItem = (error) => {
    getTrip(req.body.tripId, handleGetTrip);
  }

  let handleGetTrip = (trip) => {
    let itemIds = [];
    for (const item of trip.itemIds) {
      if (item !== req.body.id) itemIds.push(item);
    }
    trip.itemIds = itemIds;
    updateTrip(trip, handleUpdateTrip);
  }

  let handleUpdateTrip = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  }
  
  deleteItem(req.body.id, handleDeleteItem);
});

router.post("/checkoffItem", function (req, res, next) {
  res.send("Not Implemented!");
});

router.post("/sendReminder", function (req, res, next) {
  res.send("Not Implemented!");
});

module.exports = router;
