const { Users } = require('../database/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userAuth = require('./../middleware/userAuth.js');
const isAdmin = require('../middleware/isAdmin');



exports.userRegister = async(req, res)=>{
    let { name, email, password} = req.body;
    try{
        password = await bcrypt.hash(password, 8);
        const user = await Users.create({name, email, password});
        const token = jwt.sign({id: user.id, uuid: user.uuid, email, name, }, process.env.JWT)
        return res.json({token})
    }catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
}

exports.userLogin = async(req, res)=>{
    console.log(req.body);
    try{
        const { email, password } = req.body;
        const user = await Users.findOne({
            where: {email},
            attributes: ['id', 'email', 'name', 'password', 'uuid']
        });
        if(!user){
            throw new Error('User do not exist.')
        }

        const passwordCheck = await bcrypt.compare(password, user.dataValues.password)
        console.log(passwordCheck)
        if(!passwordCheck){
            throw new Error('Password incorrect.')
        }
        const token = jwt.sign({
            id:user.dataValues.id, 
            uuid:user.dataValues.uuid,
            email: user.dataValues.email,
            name:user.dataValues.name        
        }, process.env.JWT)

        res.json({info: {name: user.name, email: user.email, uuid: user.uuid} ,token: token})
        
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

exports.getUserProfile = async(req, res)=>{
    const {id, uuid, email, name} = req.user;
    try{
        const user = await Users.findOne({
            where: {uuid, id, email},
            attributes: ['name', 'email', 'createdAt']
        });
        return res.json(user)
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

exports.editUserProfile = async(req, res)=>{
    const {id, uuid, email, name} = req.user;
    try{
        const users = await Users.findOne({
            where:{
                id,
                email
            },
            attributes: ['id', 'email', 'name', 'password']
        })
       
        let keys = Object.keys(req.body);
        const editable = ['password', 'name'];

        const isValidOperation = keys.every((key) => editable.includes(key));
        if(!isValidOperation){throw new Error('Invalid Operation.')}
        
        keys.forEach(async (key)=>{
            return users[key] = req.body[key]
        })
        
        if(req.body.password){
            users.password = await bcrypt.hash(req.body.password, 8)
        }
        await users.save();
        res.json({message: "user details saved."});

    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

exports.getAllUsers = async(req, res)=>{
    let {limit, page} = req.query;
    let offset = (page-1)*limit

    try{
        const users = await Users.findAll({
            limit: limit,
            offset: offset,
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.send(users)
    }catch(error){
        console.log(error)
        return res.status(500).send(error)
    }
}