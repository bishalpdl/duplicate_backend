const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin } = require('./../database/models');

const isAdmin = async(req, res, next) => {
    try{
        if(!req.header('Authorization')){
            throw new Error('You are not logged in.')
        }
        const token = req.header('Authorization').replace('bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT)
        const admin = await Admin.findOne({
            where: {
                email: decoded.email,
                id: decoded.id
            }
        })
        if(!admin){
            throw new Error('No admin found.')
        }

        req.admin = admin;
        next();
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

module.exports = isAdmin;