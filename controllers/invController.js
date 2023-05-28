const invModel = require("../models/inventory-model")
const Util = require("../utilities/")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInvId = async function(req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getCarByInvId(inv_id)
  console.log(data)
  let nav = await utilities.getNav()
  const car_data = await utilities.buildCarDisplay(data[0])

  res.render('./inventory/singleCar',{
    title: data[0].inv_make + ' ' + data[0].inv_model,
    nav,
    car_data
  }
  
  )
}


module.exports = invCont