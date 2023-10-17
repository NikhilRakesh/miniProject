const express = require('express')
const router = express.Router()
const usercontroller = require('../controller/usercontroller')
router.use(express.urlencoded({ extended: true }))


router.get('/login', usercontroller.login)
router.get('/signup', usercontroller.signup)
router.post('/signup', usercontroller.signupdata)
router.post('/login', usercontroller.loginpost)
router.get('/logout', usercontroller.logout)
router.get('/homepage', usercontroller.homepage)












module.exports = router