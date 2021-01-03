const db = require('../index');

class Accessor {
  static getObject(ref, id, callback) {
    ref.child(id).once("value", (snapshot) => {
      callback(snapshot.val());
    });
  }

  static getObjectList(ref, ids, callback) {
    ref.once("value", (snapshot) => {
      snapshot = snapshot.toJSON();
      var objects = [];

      if (!ids) {
        callback(objects);
        return;
      }

      for (const id of ids) {
        objects.push(snapshot[id]);
      }
      callback(objects);
    });
  }

  static addObject(ref, json, callback) {
    ref.child(json.id).set(json).then(callback);
  }

  static deleteObject(ref, id, callback) {
    ref.child(id).remove().then(callback);
  }

  static updateObject(ref, json, callback) {
    ref.child(json.id).update(json).then(callback);
  }

  static createAccount(email, password, callback) {
    db.db
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        db.db
          .auth()
          .currentUser.sendEmailVerification()
          .then(function () {
            db.db.auth().signOut();
          })
        // Signed in
        callback(200, null);
      })
      .catch((error) => {
        // Error
        callback(401, error.code);
      });
  }
  static loginAccount(email, password, callback) {
    db.db
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({user}) => {
        if(user.emailVerified) {
          callback(200, "EmailVerified");
        }
        else {
          db.db.auth().signOut();
          callback(200, "EmailNotVerified");
        }
      })
      .catch((error) => {
        //Error
        callback(401, error.code);
      });
  }
  static logout(callback) {
    db.db
      .auth()
      .signOut()
      .then(() => {
        callback(200, null);
      })
      .catch((error) => {
        callback(401, error.code);
      });
  }
}

module.exports = { Accessor };
