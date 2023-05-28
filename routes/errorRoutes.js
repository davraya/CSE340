const express = require("express")
const router = new express.Router() 
const errorCont = require('../controllers/errorController')

router.get('/error', errorCont.throw500)

module.exports = router;