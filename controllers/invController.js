const invModel = require("../models/inventory-model")
const accountModel = require('../models/account-model')
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
    loggedIn: res.locals.loggedin
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
    car_data,
    loggedIn: res.locals.loggedin
  }
  
  )
}

invCont.buildManagement = async function(req, res){
  let nav = await utilities.getNav()
  let classifications = await invModel.getClassifications()
  const classificationSelect = await utilities.buildClassificationList(classifications) // where is this defined


  res.render('inventory/management', {
    title: 'Inventory Management',
    nav,
    errors: null,
    classificationSelect,
    loggedIn: res.locals.loggedin,
  })
}

invCont.buildAddClassification = async function(req, res){
  let nav = await utilities.getNav()
  res.render('inventory/add-classification', {
    title: 'Add classification',
    nav,
    errors: null,
    loggedIn: res.locals.loggedin
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
      loggedIn: res.locals.loggedin
    })
  } else {
    req.flash("notice", "Sorry, the request failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      loggedIn: res.locals.loggedin
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
    form : addForm,
    loggedIn: res.locals.loggedin
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
      loggedIn: res.locals.loggedin
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


invCont.buildEditInventory = async (req, res, next) => {
  inventoryId = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  let itemData = await invModel.getCarByInvId(inventoryId)
  itemData = itemData[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  classifications = await invModel.getClassifications()

  res.render('inventory/edit-inventory', {
    title: "Edit  " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    loggedIn: res.locals.loggedin
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    loggedIn: res.locals.loggedin
    })
  }
}


invCont.buildDeleteInventory = async (req, res, next) => {
  inventoryId = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  let itemData = await invModel.getCarByInvId(inventoryId)
  itemData = itemData[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  classifications = await invModel.getClassifications()

  res.render('inventory/delete-confirm', {
    title: "Delete  " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    loggedIn: res.locals.loggedin
  })
}

invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.deleteInventoryItem(inv_id)

  if (updateResult) {
    req.flash("notice", `The item was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.render('inventory/delete-confirm', {
      title: "Delete  " + itemName,
      nav,
      errors: null,
      inv_id: inv_id,
      inv_make: inv_make,
      inv_model:inv_model,
      inv_year: inv_year,
      inv_description: inv_description,
      inv_image: inv_image,
      inv_thumbnail: inv_thumbnail,
      inv_price: inv_price,
      inv_miles: inv_miles,
      inv_color: inv_color,
      classification_id: classification_id,
      loggedIn: res.locals.loggedin
    })
  }
}



module.exports = invCont

