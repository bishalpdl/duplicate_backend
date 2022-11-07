const nodemailer = require('nodemailer')
require('dotenv').config()

async function emailer(user, ticket) {

    let testAccount = await nodemailer.createTestAccount();
  
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP,
      port: process.env.EMAIL_PORT,
      secure: false, 
      auth: {
        user: process.env.EMAIL_SERVER_EMAIL, 
        pass: process.env.EMAIL_SERVER_PASSWORD, 
      },
       tls:{
        rejectUnauthorized:false
        }
    });
  
    let info = await transporter.sendMail({
      from: process.env.EMAIL_SERVER_EMAIL, // mine previous project email
      to: user,   
      subject: "Booking Successful.",
      text: `Your request for booking of ${ticket} has been successfull.`, 
    });
    //console.log("Messenge been delivered")
  }
  

  module.exports = emailer



  