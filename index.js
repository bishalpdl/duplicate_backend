const express = require('express');
const { Op } = require('sequelize');
const cors = require('cors');
var bodyParser = require('body-parser')
const cloudinary = require('./utils/cloudinary.js');


require('dotenv').config({ multiline: true, debug: true })
const { sequelize, QueryTypes, Users, Tickets, Bookings } = require('./models')

const adminRouter = require('./routes/admin.js');
const userRouter = require('./routes/users.js');
const ticketRouter = require('./routes/tickets.js');
const bookingRouter = require('./routes/bookings.js');
const emailer = require('./utils/emailer.js');

const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.urlencoded({limit:'50mb', extended: true}))
// var urlencodedParser = bodyParser.urlencoded({ extended: false })



app.use('/api/admin', adminRouter)
app.use('/api/users', userRouter)
app.use('/api/tickets', ticketRouter)
app.use('/api/bookings', bookingRouter)


app.get('/date', async(req, res)=>{
    const da = req.body.date;
    const d = new Date(da)
    console.log(da)
    console.log(d)
    
    const users = await Users.findAll({
        where: {
            date: {
                [Op.lt] : da
            }
        }
    })
    res.send(users)
})

app.get('/email_test', (req, res)=>{
    emailer('kxu98989@nezid.com');
    res.send('Sent')
})

app.listen(8080, async()=>{
    console.log('Backend running in Port: 8000');
    await sequelize.authenticate();
    console.log('Database Connected.')
})