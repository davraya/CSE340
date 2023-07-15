const express = require("express")
const router = new express.Router() 
const messagesCont = require('../controllers/messagesController')
const util = require('../utilities/index')

router.get('/', util.verifyAccesstoMessages, util.handleErrors(messagesCont.buildMessages))

router.get('/new-message', util.verifyAccesstoMessages, util.handleErrors(messagesCont.buildNewMessages))

router.post('/new-message', util.verifyAccesstoMessages, util.handleErrors(messagesCont.newMessages))

router.get('/:id', util.verifyAccesstoMessages, util.handleErrors(messagesCont.buildSingleMessage))

router.post('/archive/:id', util.verifyAccesstoMessages, util.handleErrors(messagesCont.archiveMessage))

router.post('/mark-read/:id', util.verifyAccesstoMessages, util.handleErrors(messagesCont.markRead))

router.post('/delete/:id', util.verifyAccesstoMessages, util.handleErrors(messagesCont.deleteMessage))

router.get('/archived/all', util.verifyAccesstoMessages, util.handleErrors(messagesCont.buildArchiveMessages))

router.get('/reply/:id', util.verifyAccesstoMessages, util.handleErrors(messagesCont.buildReply))

router.post('/reply', util.verifyAccesstoMessages, util.handleErrors(messagesCont.newMessages))



module.exports = router