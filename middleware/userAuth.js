const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Users } = require('./../models');

const userAuth = async(req, res, next) => {
    try{
        if(!req.header('Authorization')){
            throw new Error('You are not logged in.')
        }
        const token = req.header('Authorization').replace('bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT)
        const user = await Users.findOne({
            where: {
                email: decoded.email,
                id: decoded.id
            }
        })
        if(!user){
            throw new Error('No user found.')
        }

        req.user = user;
        next();
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

module.exports = userAuth;