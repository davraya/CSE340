const pool = require("../database/")


/* **********************
 *   Get Possible Receivers
 * ********************* */
async function getReceivers(account_id){
    try {
      const sql = 'SELECT account_id, account_firstname, account_lastname FROM public.account WHERE account_id != $1'
      const result = await pool.query(sql, [account_id])
      return result.rows
    } catch (error) {
      return error.message
    }
  }

async function addMessage(message_to, message_from, message_subject, message_body){
  try{
    const sql = 'INSERT INTO message (message_to, message_from, message_subject, message_body, message_read, message_archived, message_created) VALUES ($1, $2, $3, $4, FALSE, FALSE, CURRENT_TIMESTAMP) RETURNING *'
    const result = await pool.query(sql, [message_to, message_from, message_subject, message_body])
    return result
  } catch (error){
    return error.message
  }
}

async function getSentMessagesList(account_id){
  try{
    const sql = 'SELECT message_id, message_subject, message_to, message_created, message_archived FROM public.message WHERE message_from = $1'
    const result = await pool.query(sql, [account_id])
    return result.rows
  }catch(error){
    return error.message
  }
}

async function getReceivedMessagesList(account_id){
  try{
    const sql = 'SELECT message_id, message_subject, message_from, message_created, message_read FROM public.message WHERE message_to = $1'
    const result = await pool.query(sql, [account_id])
    return result.rows
  }catch(error){
    return error.message
  }
}

async function getSingleMessage(message_id){
  try{
    const sql = 'SELECT message_body, message_subject, message_from, message_to, message_created, message_read, message_archived FROM public.message WHERE message_id = $1'
    const result = await pool.query(sql, [message_id])
    return result.rows[0]
  }catch(error){
    return error.message
  }
}

async function archiveMessage(message_id){
  try{
    const sql = "UPDATE public.message SET message_archived = true WHERE message_id = $1 RETURNING *"
    const result = await pool.query(sql, [message_id])
    return result.rows[0]
  }catch(error){
    return error.message
  }
}

async function markRead(message_id){
  try{
    const sql = "UPDATE public.message SET message_read = true WHERE message_id = $1 RETURNING *"
    const result = await pool.query(sql, [message_id])
    return result.rows[0]
  }catch(error){
    return error.message
  }
}

async function deleteMessage(message_id){
  try {
    const sql = 'DELETE FROM message WHERE message_id = $1'
    const data = await pool.query(sql, [message_id])
  return data
  } catch (error) {
    new Error("Delete Message Error")
  }
}

module.exports = {getReceivers, addMessage, getSentMessagesList, getReceivedMessagesList, getSingleMessage, archiveMessage, markRead, deleteMessage}