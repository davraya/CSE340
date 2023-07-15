utilities = require('../utilities/index')
const messageModel = require('../models/messages-model')
const accountModel = require('../models/account-model')


async function buildMessages(req, res){
    let nav = await utilities.getNav()
    const messagesSent = await messageModel.getSentMessagesList(res.locals.accountData.account_id)
    let filteredMessagesSent = messagesSent.filter(element => !element.message_archived)

    const messageSentList = await utilities.buidSentMessageList(filteredMessagesSent)



    const messagesReceived = await messageModel.getReceivedMessagesList(res.locals.accountData.account_id)
    let filteredMessagesReceived = messagesReceived.filter(element => !element.message_archived)

    const messagesReceivedList = await utilities.buidReceivedMessageList(filteredMessagesReceived)

    res.render("messages/messages", {
      title: "Messages",
      nav,
      errors: null,
      loggedIn: true,
      sentMessages : messageSentList,
      receivedMessages : messagesReceivedList
    })
}

async function buildNewMessages(req, res){
    let sender_id = res.locals.accountData.account_id
    let nav = await utilities.getNav()
    const receivers = await messageModel.getReceivers(sender_id)
    let form = await utilities.buildMessageForm(receivers, sender_id)
    res.render("messages/new-message", {
      title: "New Message",
      nav,
      errors: null,
      loggedIn: res.locals.loggedin,
      form
    })
}

async function newMessages(req, res){
  const {message_to, message_from, message_subject, message_body} = req.body


  let result = await messageModel.addMessage(message_to, message_from, message_subject, message_body)
  req.flash('notice', 'New message sent')
  res.redirect("/messages")


}

async function buildSingleMessage(req, res){
  const message_data = await messageModel.getSingleMessage(req.params.id)
  let nav = await utilities.getNav()
  const id = req.params.id
  const sender = await accountModel.getAccountById(message_data.message_from)
  const receiver = await accountModel.getAccountById(message_data.message_to)
  const message_archived = message_data.message_archived
  const message_read = message_data.message_read
  const messageBody = await utilities.buildSingleMessage(message_data, sender, receiver)
  const canReply = res.locals.accountData.account_id != message_data.message_from
  console.log(`Account Id: ${canReply}`);

  res.render("./messages/single-message",{
    nav,
    title: 'Message',
    loggedIn : res.locals.loggedin,
    message : messageBody,
    archived : message_archived,
    read : message_read,
    msg_id : id,
    reply: canReply

  })
}


async function archiveMessage (req, res){
  messageModel.archiveMessage(req.params.id)
  
  res.redirect('/messages')
}

async function markRead(req, res){
  messageModel.markRead(req.params.id)

  res.redirect('/messages')
}

async function deleteMessage(req, res){
  messageModel.deleteMessage(req.params.id)

  res.redirect('/messages')
}

async function buildArchiveMessages(req, res){
  const receivedMessages = await messageModel.getReceivedMessagesList(res.locals.accountData.account_id)
  let receivedFilteredMessages = receivedMessages.filter(element => element.message_archived)

  const sentMessages = await messageModel.getSentMessagesList(res.locals.accountData.account_id)
  let sentFilteredMessages = sentMessages.filter(element => element.message_archived)

  const received = await utilities.buidReceivedMessageList(receivedFilteredMessages)
  const sent = await utilities.buidSentMessageList(sentFilteredMessages)

  console.log(received);
  const navigation = await utilities.getNav()
  res.render('./messages/archived', {
    title: 'Archived Messages',
    nav: navigation,
    sentMessages : sent,
    receivedMessages : received,
    loggedIn :  res.locals.loggedin
    
  })

}

async function buildReply(req, res){
  const initialMessage = await messageModel.getSingleMessage(req.params.id)
  const replyForm = await utilities.replyMessageForm(initialMessage)
  const navigation = await utilities.getNav()
  res.render('./messages/reply',{
    title: "Reply",
    form : replyForm,
    nav : navigation,
    loggedIn :  res.locals.loggedin
  })
}

module.exports = {buildMessages, buildNewMessages, newMessages, buildSingleMessage, archiveMessage, markRead, deleteMessage, buildArchiveMessages,buildReply}