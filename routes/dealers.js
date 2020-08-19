const express = require('express');
const router = express.Router();
const isEmpty = require('is-empty');
const dbConn = require('../config/db');
const mailing = require('../services/mail');
// const hashAlg = require('../config/passwords');

let dealer, query, id;

router.post('/dealer/create', function (req, res, err) {
    if (req) {
        dealer = {
            dealership_name: req.body.dealership_name,
            contact_person: req.body.contact_person,
            contact_number: req.body.contact_number,
            email: req.body.email,
            address: req.body.address
        };

        // check for empty fields
        if (isEmpty(dealer.dealership_name) || isEmpty(dealer.contact_person) || isEmpty(dealer.email) || isEmpty(dealer.address)) {
            console.log('Bad Request');
            res.status(400);
            res.json({
                status: 400,
                message: `Bad Request; Missing request parameters: ${dealer}`
            });
        } else {
            query = `Insert into dealers set?`;
            dbConn.query(query, dealer, function (err, rows) {
                if (!err) {
                    // send email
                    let mailData = {
                        To: dealer.email,
                        From: "kwabenaampofo5@gmail.com",
                        contact_person: dealer.contact_person,
                        dealership_name: dealer.dealership_name
                    };
                    mailing.mail('Dealership', mailData);
                    console.log('Dealer created', rows.insertId);
                    res.status(201);
                    res.json({
                        status: 201,
                        message: 'Dealer Created',
                        lastInsertID: rows.insertId
                    });
                } else {
                    console.log(`Failed, DB_ERROR: ${err.code}`);
                    console.log(err);
                    res.status(400);
                    res.json({
                        status: 400,
                        db_code: `Failed; DB_ERROR occurred: ${err.code}`,
                        db_error_message: err.sqlMessage
                    });
                }
            });
        }
    } else {
        console.log(`Internal Server Error: ${err.code}`);
        res.status(500);
        res.json({
            status: 500,
            message: `Internal Server Error: ${err.code}`
        });
    }
});


router.put('/dealer/update/:id', function (req, res, err) {
    if (req) {
        id = req.params.id;
        dealerID = parseInt(id, 10);
        // dealer update request object
        dealer = {
            dealership_name: req.body.dealership_name,
            contact_person: req.body.contact_person,
            contact_number: req.body.contact_number,
            email: req.body.email,
            address: req.body.address,
            status: 'approved'
        };

        // check for empty values
        if (isEmpty(dealer.firstName) || isEmpty(dealer.lastName) || isEmpty(dealer.email)) {
            console.log('Bad Request');
            res.status(400);
            res.json({
                status: 400,
                message: `Bad Request; Missing request parameters`,
                stream: dealer
            });
        } else {
            query = `Update dealers Set? where id = ${dealerID}`;
            dbConn.query(query, dealer, function (err, rows) {
                if (!err) {
                    console.log('Dealer Updated', rows.insertId);
                    console.log(query, dealer);
                    res.status(202);
                    res.json({
                        status: 202,
                        message: 'Dealer Updated',
                        stream: {
                            data: dealer,
                            ID: rows[0]
                        }
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
        console.log(`Internal Server Error: ${err.code}`);
        res.status(500);
        res.json({
            status: 500,
            message: `Internal Server Error: ${err.code}`
        });
    }
});

//get all approved dealers
router.get('/', function (req, res, err) {
    if (req) {
        query = `Select * from dealers where status = 'approved'`;
        dbConn.query(query, function (err, rows) {
            // db err check
            if (!err) {
                if (isEmpty(rows)) {
                    console.log('No dealers');
                    res.status(404);
                    res.json({
                        status: 404,
                        message: 'No Dealers Found'
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

router.get('/unapproved', function (req, res, err) {
    if (req) {
        query = `Select * from dealers where status = 'unapproved'`;
        dbConn.query(query, function (err, rows) {
            // db err check
            if (!err) {
                if (isEmpty(rows)) {
                    console.log('No dealers');
                    res.status(404);
                    res.json({
                        status: 404,
                        message: 'No Dealers Found'
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

module.exports = router;