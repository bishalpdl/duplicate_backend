const { Op } = require('sequelize');
const moment = require('moment');

const userAuth = require('./../middleware/userAuth');
const isAdmin = require('./../middleware/isAdmin')
const { sequelize, Users, Tickets, Bookings } = require('./../database/models');
const emailer = require('../utils/emailer');



exports.bookATicket = async(req, res)=>{

    try{
        const { status, date, getPreset: preset, selected } = req.body;
        const ticketId =  req.params.ticketId;
        const userId = req.user.id;

        const ticket = await Tickets.findOne({where: {id: ticketId} })
        
        // date checker: can't book yesterday or after ticket valid_date
        const today = moment().format('YYYY/MM/DD')
        var firstDiff = new Date(date.replace(/-/g,'/'))  - new Date(today);

        
        const finalDate = ticket.dataValues.valid_till;
        var secondDiff = new Date(finalDate.replace(/-/g,'/')) - new Date(date.replace(/-/g,'/')) ;
        
        //firstDiff is to determine if booking date is yesterday, today or tomorror ( -ve if yesterday)
        // secondDif is to dtermine if booking date is beyond or within valid date of ticket.
        // -ve gives booking date is larger than valid date
        

        if(firstDiff < 0 ){
            throw new Error('Timing error. You can not book for yesterdays.')
        }

        if(secondDiff < 0 ){
            throw new Error("Error: Ticket's valid date expires. Select date within valid date.")
        }

        // capacity checker for that date
        const noOfBookings = await Bookings.count({
            where: {
                    [Op.and] : [
                        {   date: date  },
                        {    ticketId: req.params.ticketId  }
                    ]         
            }
        })
        if(noOfBookings >= ticket.dataValues.capacity_per_day){   // === is better solution.
            throw new Error('Capacity Error. Maximum capacity fulfilled.')
        }

        
        if(preset){
            if(!selected){
                throw new Error('No Selected Seat')
            }
            
            
                const bookedSeats = await Bookings.findAll({
                    where: {
                            [Op.and] : [
                                {   date: date  },
                                {    ticketId: ticket.dataValues.id  }
                            ]         
                    },
                    attributes: ['seatNo'],
                    raw: true
                });
                // get bookedSeats array removing null values if any
                const seats = bookedSeats.map((seat) => seat.seatNo ).filter(n=>n)
                
                if(seats.includes(parseInt(selected))){
                    throw new Error('Already booked seat. Please try another seat.')
                }
            

        }


        const booking = await Bookings.create({userId, ticketId, status, date, seatNo: selected})
        res.send({message: "Ticket Booked Successfully.", uuid: booking.uuid});
        emailer(req.user.email, ticket.dataValues.title )

    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

exports.getMyBooked = async(req, res)=>{
    try{
        const userId = req.user.id
        const booked = await Bookings.findAll({
            where: {userId: userId},
            include: [Tickets],
            order: [
                ['createdAt', 'DESC']
            ],        

        })
        res.json(booked)
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

exports.getAllBookings = async(req, res) => {
    let {limit, page} = req.query;
    let offset = (page-1)*limit

    try{
        const bookings = await Bookings.findAll({ 
            limit: limit,
            offset: offset,
            order: [
                ['createdAt', 'DESC']
            ],        
            include: [Users, Tickets] 
        });
        res.send(bookings)
    }catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
}

exports.getTotalNumberOfBookings = async(req, res)=>{
    const {date} = req.body;
    try{
        const noOfBookings = await Bookings.count({
            where: {
                    [Op.and] : [
                        {   date: date  },
                        {    ticketId: req.params.ticketId  }
                    ]         
            }
        })
        ;
        res.json({alreadyBookedNo: noOfBookings})
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

exports.getSeatsInfo = async(req, res)=>{
    const {date} = req.body;
    try{
        const bookedSeats = await Bookings.findAll({
            where: {
                    [Op.and] : [
                        {   date: date  },
                        {    ticketId: req.params.ticketId  }
                    ]         
            },
            attributes: ['seatNo'],
            raw: true
        });
        // get bookedSeats array removing null values if any
        const seats = bookedSeats.map((seat) => seat.seatNo ).filter(n=>n)
        res.json({alreadyBookedNo: bookedSeats, seats})

    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

exports.getBookingInfoForPrinting = async(req, res)=>{
    const {bookingId} = req.params;
    
    try{
        const bookedTicket = await Bookings.findOne({
            where: { uuid: bookingId},
            include: [Tickets, Users]
        });
        
        res.json({bookedTicket})
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}