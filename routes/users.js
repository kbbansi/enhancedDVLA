var express = require('express');
var router = express.Router();
const isEmpty = require('is-empty');
const dbConn = require('../config/db');
const passwordHash = require('../config/passwords');


let user, query, id;


/* GET users listing. */
router.get('/', function (req, res, err) {
  if (req) {
    query = `Select * from users as Users`;
    dbConn.query(query, function (err, rows) {
      // db err check
      if (!err) {
        if (isEmpty(rows)) {
          console.log('No users');
          res.status(404);
          res.json({
            status: 404,
            message: 'No Users Found'
          });
        } else {
          console.log(query, rows[0].Users);
          res.status(200);
          res.json({
            status: 200,
            data: rows
          });
        }
      } else {
        console.log(err.code);
        res.status(400);
        res.json({
          status: 400,
          message: `Encountered Db error: ${err.code}`
        });
      }
    });
  } else {
    console.log(`An Error Occurred: ${err.code}`);
    res.status(500);
    res.json({
      status: 500,
      reason: `Internal Server Error: ${err.code}`
    })
  }
});


// get one user
router.get('/user/:id', function (req, res, err) {
  if (req) {
    id = req.params.id;
    let userID = parseInt(id, 10);

    query = `Select * from users as User where id = ${userID}`;
    dbConn.query(query, function (err, rows) {
      if (!err) {
        if (isEmpty(rows)) {
          console.log(`Empty Row set, No user with user ID ${userID} found`);
          res.status(404);
          res.json({
            status: 404,
            message: `Empty Row set, No user with user ID ${userID} found`
          });
        } else {
          console.log(`User found: ${rows[0].User}`);
          res.status(200);
          res.json({
            status: 200,
            data: rows
          });
        }
      } else {
        console.log(`Failed; An Error Occurred: ${err.code}`);
        res.status(400);
        res.json({
          status: 400,
          message: `Failed; An Error Occurred: ${err.code}`
        });
      }
    });
  } else {
    console.log(`Failed; Internal Server Error: ${err.code}`);
        res.status(500);
        res.json({
          status: 500,
          message: `Failed; Internal Server Error: ${err.code}`
        });
  }
});



// add user to the system
router.post('/user/create', function (req, res, err) {
  if (req) {
    user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      otherNames: req.body.otherNames,
      email: req.body.email,
      password: passwordHash.passwordHash(req.body.password)
    };

    // check for empty fields
    if (isEmpty(user.firstName) || isEmpty(user.lastName) || isEmpty(user.email) || isEmpty(user.password)) {
      console.log('Bad Request');
      res.status(400);
      res.json({
        status: 400,
        message: `Bad Request; Missing request parameters: ${user}`
      });
    } else {
      query = `Insert info users set?`;
      dbConn.query(query, user, function (err, rows) {
        if (!err) {
          console.log('User created',rows.insertId);
          res.status(201);
          res.json({
            status: 201,
            message: 'User Created',
            lastInsertID: rows.insertId
          });
        } else {
          console.log(`Failed: ${err.code}`);
          res.status(400);
          res.json({
            status: 400,
            message: `Failed; An Error occurred: ${err.code}`
          });
        }
      });
    }
  } else {
   console.log(err.code);
   res.status(500);
   res.json({
     status: 500,
     message: `Failed; Internal Server Error: ${err.code}`
   });
  }
});

// update user account

module.exports = router;
