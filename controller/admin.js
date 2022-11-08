const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const isAdmin = require('./../middleware/isAdmin.js');

const { sequelize, Users, Tickets, Bookings, Admin } = require('./../models');



exports.getAdminInfo = async(req, res)=>{
    try{
        const admin = await Admin.findAll({
            attributes: ['name', 'email', 'createdAt']
        })
        res.status(200).json({info: admin})
    }catch(err){
        console.log(err)
        return res.status(500).send(err)
    }
}

exports.adminLogin = async(req, res)=>{
    try{
        const { email, password } = req.body;
        const admin = await Admin.findOne({
            where: {email},
            attributes: ['id', 'email', 'name', 'password']
        });
        if(!admin){
            throw new Error('Admin do not exist.')
        }

        const passwordCheck = await bcrypt.compare(password, admin.dataValues.password)
        if(!passwordCheck){
            throw new Error('Password incorrect.')
        }
        const token = jwt.sign({email: admin.dataValues.email, isAdmin: true, id:admin.dataValues.id}, process.env.JWT)
        res.json({info: {name: admin.name, email: admin.email} ,token: token})
        
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}


exports.editAdminInfo = async(req, res)=>{
    try{
        const admin = await Admin.findOne({
            where:{
                id: req.admin.id,
                email: req.admin.email
            },
            attributes: ['id', 'email', 'name', 'password']
        })
       
        let keys = Object.keys(req.body);
        const editable = ['email', 'name'];
        const isValidOperation = keys.every((key) => editable.includes(key));
        if(!isValidOperation){throw new Error('Invalid Operation.')}
        
        keys.forEach(async (key)=>{
            return admin[key] = req.body[key]
        })
        await admin.save();
        res.json({message: "Admin details saved."});

    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

exports.getSiteStatistics = async(req, res)=>{
    try{

        let totalUsers = Users.count({});
        let totalTickets = Tickets.count({});
        
        let totalBookings = Bookings.findAll({
            attributes: ['status', [sequelize.fn(
                'count', 
                sequelize.col('status')),
                'count'
            ]],
            group: ['Bookings.status'],
            raw:true
        });



        [totalUsers, totalTickets, totalBookings] = await Promise.all([
            totalUsers,
            totalTickets,
            totalBookings
        ])
        
        const statusCategoryTotal = totalBookings.reduce((prev,curr)=>{
            prev[curr.status] = curr.count;
            return prev;
        }, {});
        const bookedTotal = parseInt(statusCategoryTotal.buy) + parseInt(statusCategoryTotal.reserve);        


        //other Statistics;


        res.send({
            totalUsers,
            totalTickets,
            statusCategoryTotal,
            bookedTotal               
        })

        

    }catch(error){
        return res.status(500).json({error: error.message})
    }
}