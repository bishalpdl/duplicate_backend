const isAdmin = require('./../middleware/isAdmin');
const { sequelize,  Tickets, Sequelize } = require('./../models')
const cloudinary = require('./../utils/cloudinary.js')
const moment = require('moment');
const { Op } = require('sequelize');


exports.ticketHomepage = async(req, res)=>{
    const today = moment().format('YYYY-MM-DD')

    try{
        const tickets = await Tickets.findAll({
            where: sequelize.where(sequelize.fn(
                    'date', sequelize.col('valid_till')), '>',
                    today
                ),
            
            limit: 20,
            order: [
                ['createdAt', 'DESC']
            ],        

        })
        res.send(tickets)
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}


exports.postTicket = async(req, res)=>{
    const { title, description, price, capacity_per_day, valid_till, time, agency, previewSource, preset } = req.body;
    try{
        const imageUpload = await cloudinary.uploader.upload(previewSource, {
            upload_preset: 'first_testing'
        })

        const ticket = await Tickets.create({ title, description, price, capacity_per_day,preset, valid_till, time, agency, imageURL: imageUpload.url });
        return res.json(ticket)

    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

exports.getAllTickets = async(req, res)=>{
    let {limit, page} = req.query;
    let offset = (page-1)*limit

    try{
        const tickets = await Tickets.findAll({
            limit: limit,
            offset: offset,
            order: [
                ['createdAt', 'DESC']
            ]
        })
        res.send(tickets)
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

exports.searchTicket = async(req, res)=>{
    let question = req.query.qn;
    const today = moment().format('YYYY-MM-DD')
    
    try{
        if(!question){
            throw new Error('No Search Question Parameter')
        }

        //exact ticket title search matches query
        if(question[question.length-1] === '"' && question[0] === '"'){
            question = question.slice(1, question.length-1);

            let tickets = await Tickets.findAll({
                where: {
                        [Op.and]:[
                            sequelize.where(sequelize.fn(
                                'date', sequelize.col('valid_till')), '>',today
                            ),
                            {
                                title:{
                                    [Op.iLike]:'%'+question+'%'
                                }                            
                            }
                        ]
                    },
                limit: 10,
            })
            return res.send(tickets)
        }
        
        // Query string is inside of title
        if(question[question.length-1] === "'" && question[0] === "'"){
            question = question.slice(1, question.length-1);
            let tickets = await Tickets.findAll({
                where: {
                        [Op.and]:[
                            sequelize.where(sequelize.fn(
                                'date', sequelize.col('valid_till')), '>',today
                            ),
                            {
                            title:{
                                [Op.iLike]:'%'+question+'%'
                            }
                            }
                        ]
                    },
                limit: 10,
            })
            return res.send(tickets)
        }
        
        // Search inside of title and description
        console.log('here')
        let tickets = await Tickets.findAll({
            where: {
                    [Op.and]:[
                        sequelize.where(sequelize.fn(
                            'date', sequelize.col('valid_till')), '>',today
                        ),
                        {   
                            [Op.or]: [
                            {description: { 
                                    [Op.iLike]: `%${question}%`
                                }
                            },
                            {title: { 
                                    [Op.iLike]: `%${question}%`
                                }
                            }
                        ]
                        }
                    ]
                },
            limit: 10,
            order: [
                ['createdAt', 'DESC']
            ]

        })
        return res.send(tickets)
        


    }catch(error){
        console.log(error);
        return res.status(500).json({error: error.message});
    }
}

exports.getTicketByUuid = async(req, res)=>{
    try{
        const ticket = await Tickets.findOne({
            where: {uuid: req.params.uuid}
        })
        //console.log(ticket)
        if(!ticket){
            throw new Error('Ticket not found.')
        }

        res.send(ticket)
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}