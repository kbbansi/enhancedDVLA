const express = require('express');
const router = express.Router();
const isEmpty = require('is-empty');
const dbConn = require('../config/db');

const hashAlg = require('../config/passwords');

let user, query, passwordCheck, id;

// login route
router.post('/login', function (req, res, err) {
    if (req) {
        user = {
            userName: req.body.userName,
            password: req.body.password
        };

        if (isEmpty(user.userName) || isEmpty(user.password)) {
            console.log('Bad Request');
            res.status(400);
            res.json({
                status: 400,
                message: `Bad Request; Missing Request Parameters`,
                stream: user
            })
        } else {
            // mock out password check
            passwordCheck = `Select password from users where userName = '${user.userName}'`;
            dbConn.query(passwordCheck, function (err, row) {
                if (!err) {
                    console.log(passwordCheck);
                    if (isEmpty(row)) {
                        console.log(`FAIL; No such user found`);
                        res.status(404);
                        res.json({
                            status: 404,
                            message: `FAIL; No such user found`
                        });
                    } else {
                        // res.status()
                        let encryptedPassword = row[0];
                        let hashPassword = hashAlg.hashCompare(user.password.toString(), encryptedPassword.password);

                        if (hashPassword) {
                            query = `Select * from users where userName = '${user.userName}'`;
                            dbConn.query(query, function (err, rows) {
                                if (!err) {
                                    console.log(query);
                                    res.status(200);
                                    res.json({
                                        status: 200,
                                        data: rows
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
                        } else {
                            console.log(hashPassword);
                            res.status(400);
                            res.json({
                                status: 400,
                                message: `Error: Wrong UserName and Password combination`
                            });
                        }
                    }
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


module.exports = router;