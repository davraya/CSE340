const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getCarByInvId(inv_id){
  try{
    const data = await pool.query(
      "SELECT * FROM inventory WHERE inv_id = $1",
      [inv_id]
    )
    return data.rows
  }catch(error){
    console.error("getCarByInvId error " + error)
  }
}

async function addClassification(classification){

  try{
    const sql = 'INSERT INTO classification (classification_name) VALUES ($1) RETURNING *'
    return await pool.query(sql, [classification])
  } catch (error){
    return error.message
  }
}

async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id){
  const inv_image ='/images/vehicles/no-image.png'
  const inv_thumbnail = '/images/vehicles/no-image.png'
  try{
    const sql = 'INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
    return await pool.query(sql,       [inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id])
  } catch (error){
    return error.message
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getCarByInvId, addClassification, addInventory}
