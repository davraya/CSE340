const invModel = require("../models/inventory-model")
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
  let nav = await utilities.getNav()
  const car_data = await utilities.buildCarDisplay(data[0])

  res.render('./inventory/singleCar',{
    title: data[0].inv_make + ' ' + data[0].inv_model,
    nav,
    car_data
  }
  
  )
}

invCont.buildManagement = async function(req, res){
  let nav = await utilities.getNav()
  res.render('inventory/management', {
    title: 'Management',
    nav,
    errors: null,
  })
}

invCont.buildAddClassification = async function(req, res){
  let nav = await utilities.getNav()
  res.render('inventory/add-classification', {
    title: 'Add classification',
    nav,
    errors: null,
  })
}

invCont.addClassification = async function (req, res){
  let nav = await utilities.getNav()
  const addResult = await invModel.addClassification(req.body.classification_name)

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${req.body.classification_name}`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the request failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

invCont.buildAddInventory = async function(req, res){
  let nav = await utilities.getNav()
  classifications = await invModel.getClassifications()
  let addForm = await utilities.buildInventorynForm(classifications)
  res.render('inventory/add-inventory', {
    title: 'Add to Inventory',
    nav,
    errors: null,
    form : addForm
  })
}

invCont.addInventory = async function(req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body

  const invResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id)

  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered a ${inv_make} ${inv_model}. Please log in.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add to Inventory",
      nav,
      errors: null,
    })
  }
}

module.exports = invCont