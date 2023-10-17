const express = require('express')
const router = express.Router()
router.use(express.urlencoded({ extended: true }))
const admincontroller = require('../controller/admincontroller')

router.get('/admin', admincontroller.admin)
router.get('/adminlogin', admincontroller.adminloginpage)
router.post('/admin', admincontroller.adminlogin)
router.get('/adminlogout', admincontroller.adminlogout)
router.get('/adminusers', admincontroller.adminusers)
router.get('/userblock/:userId', admincontroller.userblock)
router.get('/userunblock/:userId', admincontroller.userunblock)
router.get('/useredit/:userId', admincontroller.useredit)
router.get('/userdelete/:userId', admincontroller.userdelete)
router.get('/usersearch', admincontroller.usersearch)
router.post('/updateuser/:userId', admincontroller.updateuser)
router.post('/createuser', admincontroller.createuser)


















module.exports = router