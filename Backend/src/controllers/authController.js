const bcrypt = require("bcrypt");
const user = require("../models/user.model");
const jwtAuthorization = require("../utils/jwtAuthorization");

exports.signUpUser = async (req, res) => {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      const userToCreate = new user({
        fullname: req.body.fullname,
        username: req.body.username,
        password: hash,
      });
      user.find({ username: req.body.username }, function (err, user) {
        if (err) {
          res.status(400).send(err);
        }

        if (user.length > 0) {
          res.status(406).send("Duplicated User");
        } else {
          userToCreate.save(function (err, newUser) {
            if (err) {
              res.status(400).send(err);
            }
            res.status(200).send("Registered User");
          });
        }
      });
    });
  });
};
exports.loginUser = async (req, res) => {
  user.find({ username: req.body.username }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    }

    if (user.length > 0) {
      bcrypt
        .compare(req.body.password, user[0].password)
        .then(function (result) {
          if (result) {
            jwtAuthorization.generateToken(
              { user: req.body.username },
              (token) => {
                res.status(200).json(token);
              }
            );
          } else {
            res.status(401).send("Not Authorized");
          }
        });
    } else {
      res.status(401).send("Not Authorized");
    }
  });
};
