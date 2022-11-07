const express = require('express');
const isAdmin = require('./../middleware/isAdmin');

const ticketController = require('../controller/ticket.js')

const router = express.Router();

router.post('/', isAdmin, ticketController.postTicket)

router.get('/homepage', ticketController.ticketHomepage)

router.get('/search', ticketController.searchTicket)

router.get('/all', isAdmin, ticketController.getAllTickets)


router.get('/:uuid', ticketController.getTicketByUuid)



//testing code


module.exports = router;