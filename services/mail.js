const nodeMailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require('dotenv/config');


const oauth2Client = new OAuth2(
    process.env.OAUTHCLIENTID,
    process.env.OAUTHCLIENTSECRET,
    process.env.AUTHORIZATION_URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

let transporter, mailObject, mailOptions;

exports.mail = function (serviceName, data) {
    switch (serviceName) {
        case 'Appointment':
            console.log(data);
            console.log(process.env.OAUTHCLIENTID);
            transporter = nodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    type: "OAuth2",
                    clientId: process.env.OAUTHCLIENTID,
                    clientSecret: process.env.OAUTHCLIENTSECRET,
                    access_Type: "offline"
                }
            });
            transporter.on('token', token => {
                console.log('Got a new Access token');
                console.log('User: %s', token.user);
                console.log('Access Token: %s', token.accessToken);
                console.log('Expires in: %s', new Date(token.expires));
            });
            mailObject = {
                To: data.To,
                From: data.From,
                Subject: data.Subject,
                Message: 'Dear' + data.firstName + ',\nYou have succesfully booked a schedule for ' + data.service + '.\nYour appointment key is: ' + data.unique_appointment_key + '. Please keep this key as you will be required to present it at the DVLA office.',
                HtmlMessage: `Dear <strong>${data.firstName}</strong>, <p>You have successfully scheduled an appointment for <strong>${data.service}</strong>.</p>
                <p>Your appointment key is <strong>${data.unique_appointment_key}.</strong></p>
                <p>Please keep this key as you will be required to present it at the DVLA office.</p>
                `
            };
            mailOptions = {
                from: mailObject.From,
                to: mailObject.To,
                subject: mailObject.Subject,
                text: mailObject.Message,
                html: mailObject.HtmlMessage,
                auth: {
                    user: "kwabenaampofo5@gmail.com",
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: process.env.ACCESS_TOKEN,
                    expires: 1484314697598
                },
            };

            // send mail
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log('Oops and error occurred',err.message.toString());
                    return err;
                } else {
                    console.log(info);
                    return info
                }
            });
            break;

        case 'Dealership':
            console.log(data);
            transporter = nodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    type: "OAuth2",
                    clientId: process.env.OAUTHCLIENTID,
                    clientSecret: process.env.OAUTHCLIENTSECRET,
                    access_Type: "offline"
                }
            });
            transporter.on('token', token => {
                console.log('Got a new Access token');
                console.log('User: %s', token.user);
                console.log('Access Token: %s', token.accessToken);
                console.log('Expires in: %s', new Date(token.expires));
            });
            mailObject = {
                To: data.To,
                From: data.From,
                Subject: data.Subject,
                Message: 'Dear ' + data.contact_person + ',\nYour request to join DVLA Approved Dealers has been received.\nYour will be contacted in due time to schedule an inspection of your premises. Thank you',
                HtmlMessage: `Dear <strong>${data.contact_person}</strong>, <p>Your request to have your dealership, <strong>${data.dealership_name}, has been received.</p>
                <p>nYour will be contacted in due time to schedule an inspection of your premises. Thank you</p>`
            };
            mailOptions = {
                from: mailObject.From,
                to: mailObject.To,
                subject: mailObject.Subject,
                text: mailObject.Message,
                html: mailObject.HtmlMessage,
                auth: {
                    user: "kwabenaampofo5@gmail.com",
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: process.env.ACCESS_TOKEN,
                    expires: 1484314697598
                },
            };

            // send mail
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err.message.toString());
                    return err;
                } else {
                    console.log(info);
                    return info
                }
            });
            break;
        default:
            break;
    }
}