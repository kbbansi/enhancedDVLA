const express = require('express');
const router = express.Router();
const isEmpty = require('is-empty');
const dbConn = require('../config/db');
const mailing = require('../services/mail');

// const hashAlg = require('../config/passwords');

let appointment, query, id;

// create route
router.post('/appointment/create', function (req, res, err) {
    if (req) {
        appointment = {
            client_name: req.body.client_name,
            email: req.body.email,
            contact: req.body.contact,
            service_type: req.body.service_type,
            time_slot: req.body.time_slot,
            booked_via: req.body.booked_via,
            unique_appointment_key: req.body.client_name.toString().substr(1, 6).toUpperCase() + '- DVLA',
            created_on: new Date()
        };

        // check for empty fields
        if (isEmpty(appointment.client_name) || isEmpty(appointment.service_type) || isEmpty(appointment.unique_appointment_key)) {
            console.log('BAD Request');
            res.status(400);
            res.json({
                status: 400,
                message: `Bad Request; Missing request parameters`,
                stream: appointment
            });
        } else {
            query = `Insert into appointments set?`;
            dbConn.query(query, appointment, function (err, rows) {
                if (!err) {
                    console.log('Appointment Created', appointment.client_name, ':', appointment.time_slot, ':', appointment.unique_appointment_key);
                    res.status(201);
                    // send mail
                    let mailData = {
                        To: appointment.email,
                        From: "kwabenaampofo5@gmail.com",
                        Subject: 'Appointment Notice',
                        firstName: appointment.client_name,
                        service: appointment.service_type,
                        unique_appointment_key: appointment.unique_appointment_key
                    };
                    mailing.mail('Appointment', mailData);
                    res.json({
                        status: 201,
                        message: 'Appointment Created',
                        stream: {
                            client_name: appointment.client_name,
                            email: appointment.email,
                            contact: appointment.contact,
                            unique_key: appointment.unique_appointment_key,
                            appointment_time: appointment.time_slot,
                            createdOn: appointment.created_on,
                            created_via: appointment.booked_via
                        }
                    });
                    //todo send email/sms notification
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
            })
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

// get all new appointments
router.get('/new', function (req, res, err) {
    // let date = req.params.date;
    if (req) {
        query = `Select * from appointments where status = 'new'`;
        dbConn.query(query, function (err, rows) {
            if (!err) {
                if (isEmpty(rows)) {
                    console.log('No Appointments');
                    res.status(404);
                    res.json({
                        status: 404,
                        message: 'No New Appointments'
                    });
                } else {
                    console.log(query, rows);
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
        })
    } else {
        console.log(`An Error Occurred: ${err.code}`);
        res.status(500);
        res.json({
            status: 500,
            reason: `Internal Server Error: ${err.code}`
        })
    }
});

// get all active appointments
router.get('/active', function (req, res, err) {
    // let date = req.params.date;
    if (req) {
        query = `Select * from appointments where status = 'active'`;
        dbConn.query(query, function (err, rows) {
            if (!err) {
                if (isEmpty(rows)) {
                    console.log('No Appointments');
                    res.status(404);
                    res.json({
                        status: 404,
                        message: 'No New Appointments'
                    });
                } else {
                    console.log(query, rows);
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
        })
    } else {
        console.log(`An Error Occurred: ${err.code}`);
        res.status(500);
        res.json({
            status: 500,
            reason: `Internal Server Error: ${err.code}`
        })
    }
});


// update one appointment
router.put('/appointment/update/:id', function (req, res, err) {
    if (req) {
        id = req.params.id;
        let appointmentID = parseInt(id, 10);

        appointment = {
            unique_appointment_key: req.body.unique_appointment_key,
            arrival_time: req.body.arrival_time,
            client_name: req.body.client_name,
            email: req.body.email,
            contact: req.body.contact,
            served_by: req.body.served_by,
            status: 'active'
        };

        if (isEmpty(appointment.unique_appointment_key) || isEmpty(appointment.arrival_time)) {
            console.log('Bad Request');
            res.status(400);
            res.json({
                status: 400,
                message: 'Bad Request; Missing parameters',
                stream: appointment
            });
        } else {
            query = `Update appointments set? where id = ${appointmentID}`;
            dbConn.query(query, appointment, function (err, rows) {
                if (!err) {
                    console.log('Appointment Updated');
                    console.log(query, appointment);
                    res.status(200);
                    res.json({
                        status: 200,
                        message: 'Appointment Updated',
                        stream: {
                            data: appointment
                        }
                    });
                } else {
                    console.log(err.code);
                    res.status(400);
                    res.json({
                        status: 400,
                        message: `Encountered Db error: ${err.code}`
                    });
                }
            })
        }

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