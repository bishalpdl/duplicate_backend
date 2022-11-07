const express = require('express');
const { Users } = require('../database/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userAuth = require('./../middleware/userAuth.js');
const isAdmin = require('../middleware/isAdmin');

const userController = require('../controller/user.js')

const router = express.Router();

router.post('/register', userController.userRegister)

router.post('/login', userController.userLogin)

router.get('/me', userAuth, userController.getUserProfile)

router.put('/me/edit', userAuth, userController.editUserProfile)


router.get('/all', isAdmin, userController.getAllUsers)

module.exports = router;