var express = require('express');
const { getTraveler, updateTraveler, getTravelerList } = require('../db/models/traveler');
var router = express.Router();


router.get('/getAccount/:id', function(req, res, next) {
    let handleGetAccount = (account) => {
        res.json({account});
    }
    getTraveler(req.params.id, handleGetAccount);
});

router.put('/editAccount', function(req, res, next) {
    let handleGetTraveler = (traveler) => {
        if(traveler) {
            if(req.body.firstName) traveler.firstName = req.body.firstName;
            if(req.body.lastName) traveler.lastName = req.body.lastName;
            if(req.body.username) traveler.username = req.body.username;
            updateTraveler(traveler, handleUpdateTraveler);
        }
    }
    let handleUpdateTraveler = (error) => {
        if (error) res.sendStatus(401);
        else res.sendStatus(200);
    }
    getTraveler(req.body.travelerId, handleGetTraveler);
});

router.get('/getFriends/:id', function(req, res, next) {
    let handleGetTraveler = (traveler) => {
        getTravelerList(traveler.friendIds, handleGetFriends);
    }

    let handleGetFriends = (friends) => {
        res.json({ status: 200, friends });
    }

    getTraveler(req.params.id, handleGetTraveler);
});

router.get('/getFriendInvites/:id', function(req, res, next) {
    let handleGetTraveler = (traveler) => {
        getTravelerList(traveler.friendInvitations, handleGetFriendInvites);
    }

    let handleGetFriendInvites = (invitations) => {
        res.json({ status: 200, invitations });
    }

    getTraveler(req.params.id, handleGetTraveler);
});

router.post('/addFriend', function(req, res, next) {
    let handleGetTraveler = (traveler) => {
        if (!traveler.friendIds) traveler.friendIds = [];
        if (!traveler.friendInvitations) traveler.friendInvitations = [];

        for (const friend of traveler.friendInvitations) {
            if (friend === req.body.friendId) {
                res.sendStatus(204);
                return;
            }
        }

        getTraveler(req.body.friendId, handleGetOtherTraveler);
    }

    let handleGetOtherTraveler = (traveler) => {
        // Traveler invited must exist
        if (!traveler) {
            res.sendStatus(404);
            return;
        }

        if (!traveler.friendIds) traveler.friendIds = [];
        if (!traveler.friendInvitations) traveler.friendInvitations = [];

        // No duplicate friends.
        for (const friend of traveler.friendIds) {
            if (friend === req.body.id) {
                res.sendStatus(202);
                return;
            }
        }

        // No duplicate friends.
        for (const friend of traveler.friendInvitations) {
            if (friend === req.body.id) {
                res.sendStatus(203);
                return;
            }
        }

        traveler.friendInvitations.push(req.body.id);
        updateTraveler(traveler, handleUpdateTraveler);
    }

    let handleUpdateTraveler = (error) => {
        if (error) res.sendStatus(401);
        else res.sendStatus(200);
    }

    // No self friend requests.
    if (req.body.id === req.body.friendId) {
        res.sendStatus(403);
        return;
    }

    // No empty input.
    if (!req.body.friendId || req.body.friendId === "") {
        res.sendStatus(401);
        return;
    }

    getTraveler(req.body.id, handleGetTraveler);
});

router.delete('/removeFriend', function(req, res, next) {
    let handleGetTraveler = (traveler) => {
        var friendIds = [];
        if (!traveler.friendIds) traveler.friendIds = [];
        for (const friend of traveler.friendIds) {
            if (friend !== req.body.friendId) friendIds.push(friend);
        }

        updateTraveler({ id: req.body.id, friendIds}, handleUpdateTraveler);
    }

    let handleUpdateTraveler = (error) => {}

    let handleGetFriend = (traveler) => {
        var friendIds = [];
        if (!traveler.friendIds) traveler.friendIds = [];
        for (const friend of traveler.friendIds) {
            if (friend !== req.body.id) friendIds.push(friend);
        }

        updateTraveler({ id: req.body.friendId, friendIds}, handleUpdateFriend);
    }

    let handleUpdateFriend = (error) => {
        if (error) res.sendStatus(401);
        else res.sendStatus(200);
    }

    getTraveler(req.body.id, handleGetTraveler)
    getTraveler(req.body.friendId, handleGetFriend)
});

router.post('/acceptFriend', function(req, res, next) {
    let handleGetTraveler = (traveler) => {
        var newInvites = [];
        for (const invite of traveler.friendInvitations) {
            if (invite !== req.body.friendId) newInvites.push(invite);
        }

        if (!traveler.friendIds) traveler.friendIds = [];
        traveler.friendIds.push(req.body.friendId);
        traveler.friendInvitations = newInvites;

        updateTraveler(traveler, handleUpdateTraveler);
    }

    let handleUpdateTraveler = (error) => {}

    let handleGetFriend= (friend) => {
        if (!friend.friendIds) friend.friendIds = [];
        friend.friendIds.push(req.body.travelerId);
        
        updateTraveler(friend, handleUpdateFriend);
    }

    let handleUpdateFriend = (error) => {
        if (error) res.sendStatus(401);
        else res.sendStatus(200);
    }
    
    getTraveler(req.body.travelerId, handleGetTraveler);
    getTraveler(req.body.friendId, handleGetFriend);
});

router.post('/rejectFriend', function(req, res, next) {
    let handleGetTraveler = (traveler) => {
        var newInvites = [];
        for (const invite of traveler.friendInvitations) {
            if (invite !== req.body.friendId) newInvites.push(invite);
        }

        traveler.friendInvitations = newInvites;
        updateTraveler(traveler, handleUpdateTraveler);
    }

    let handleUpdateTraveler = (error) => {
        if (error) res.sendStatus(401);
        else res.sendStatus(200);
    }
    
    getTraveler(req.body.travelerId, handleGetTraveler);
});

module.exports = router;
