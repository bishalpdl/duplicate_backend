const express = require('express');
const isAdmin = require('./../middleware/isAdmin.js');


const adminController = require('../controller/admin.js')


const router = express.Router();

router.get('/info', isAdmin, adminController.getAdminInfo)

router.post('/login', adminController.adminLogin)

router.put('/edit', isAdmin, adminController.editAdminInfo)

router.get('/stats', isAdmin, adminController.getSiteStatistics)


module.exports = router;