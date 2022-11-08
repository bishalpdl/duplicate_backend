const express = require('express');
const { Op } = require('sequelize');
const moment = require('moment');

const userAuth = require('./../middleware/userAuth');
const isAdmin = require('./../middleware/isAdmin')
const { sequelize, Users, Tickets, Bookings } = require('./../models');
const emailer = require('../utils/emailer');

const bookingController = require('../controller/booking.js')

const router = express.Router();

router.post('/test', async(req, res)=>{
    const { status, quantity, userId, date, ticketId } = req.body;

    try{
        const booking = await Bookings.create({ status, quantity, userId, ticketId, date });
        return res.json(booking)
    }catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
})

router.post('/:ticketId',  userAuth, bookingController.bookATicket)

router.get('/mybooked', userAuth, bookingController.getMyBooked)

router.get('/all', isAdmin, bookingController.getAllBookings)


// Seats Capacity finder should be get method but 
// post is used to bypass frontend error  in axios/fetch
router.post('/capacity/:ticketId', bookingController.getTotalNumberOfBookings )

// Booked Seats finder should be get method but 
// post is used to bypass frontend error  in axios/fetch
router.post('/seats/:ticketId', bookingController.getSeatsInfo)

// get booking info & can view booking info
router.get('/print/:bookingId', bookingController.getBookingInfoForPrinting)


// router.post('/posting/new', async(req, res)=>{
//     console.log('here')
//     try{
//         console.log(req.body)
//         console.log(req.headers)
//     }catch(err){
//         return res.status(500).json(err)
//     }
// })



module.exports = router;