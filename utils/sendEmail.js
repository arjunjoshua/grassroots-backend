require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(recipient, phoneNumber, username, details)
{
        let mailBody;
        if (details) {
            mailBody = `Hello ${username},

            ${phoneNumber} is your opponent's contact number. 
            The host has also provided additional details as follows:

            ${details}

            Good luck!`;
        } else {
            mailBody = `Hello ${username},

            ${phoneNumber} is your opponent's contact number. Good luck!`;
        }

        const msg = {
        to: recipient,
        from: { 
            email: "grassrootsnotifications@gmail.com", 
            name: 'Grassroots Notifications' 
        },
        subject: 'Contact Details for your upcoming match',
        text: mailBody,
    };

    return sgMail.send(msg);
}

module.exports = sendEmail;