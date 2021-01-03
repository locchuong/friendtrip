var express = require("express");
const { Accessor } = require("../db/models/accessor");
const {
  generateTravelerJSON,
  addTraveler,
  getTraveler,
} = require("../db/models/traveler");
var router = express.Router();

router.put("/signup", function (req, res, next) {
  // Callback for Firebase auth.
  let handleCreateAccount = (status, code) => {
    const id = req.body.email.replace(".", "");

    if (status === 200) {
      const data = generateTravelerJSON(
        id,
        req.body.email,
        req.body.username,
        req.body.first,
        req.body.last,
        Date.now(),
        [],
        [],
        [],
        []
      );
      addTraveler(data, handleCreateTraveler);
    } else {
      res.json({ status: 401, code });
    }
  };

  // Callback for Firebase addObject (Traveler).
  let handleCreateTraveler = (error) => {
    var status;
    if (error) status = 401;
    else status = 200;
    res.json({ status, code: "none" });
  };

  Accessor.createAccount(
    req.body.email,
    req.body.password,
    handleCreateAccount
  );
});

router.post("/login", function (req, res, next) {
  // Accessor's loginAccount callback function
  let handleLoginAccount = (status, code) => {
    if (status === 200) {
      if(code === "EmailVerified") {
        const id = req.body.email.replace(".", "");
        getTraveler(id, handleGetTraveler);
      }
      else if (code === "EmailNotVerified") {
        res.json({status: 200, code});
      }
    } else {
      // Return error message
      res.json({ status: 401, code });
    }
  };

  // getTraveler callback function
  let handleGetTraveler = (snapshotValue) => {
    res.json({ status: 200, code: "Success", id: snapshotValue.id });
  };
  Accessor.loginAccount(req.body.email, req.body.password, handleLoginAccount);
});

// router.post("/loginWithGoogle", function(req,res,next) {
//   let handleLoginAccount = (status, code) => {
//     console.log(status, code);
//   }
//   let handleGetTraveler = (snapshotValue) => {
    
//   }
//   let handleCreateAccount = (status, code) => {

//   }
//   Accessor.loginAccountGoogle(handleLoginAccount);
// });

router.post("/logout", function (req, res) {
  // Accessor's logout callback function
  let handleLogout = (status, code) => {
    if (status === 200) {
      // sign out successful
      res.json({ status: 200 });
    } else {
      // Return error message
      res.json({ status: 401, code });
    }
  };

  Accessor.logout(handleLogout);
});

module.exports = router;
