require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(recipient, phoneNumber, username)
{
        const msg = {
        to: recipient,
        from: process.env.EMAIL_ID,
        subject: 'Contact Details for your upcoming match',
        text: `Hello ${username}, 
         
        ${phoneNumber} is your opponent's contact number. Good luck!`,
    };

    return sgMail.send(msg);
}

module.exports = sendEmail;