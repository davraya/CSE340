const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
invModel = require('../models/inventory-model')

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim()
        .isAlpha()


    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Registration",
        nav,
        classification_name
      })
      return
    }
    next()
  }
  

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.InventoryRules = () => {
  return [
    // firstname is required and must be string
    body("Make")
      .trim()
      .isAlpha()
      .withMessage("Make can only be letters"),

    body("inv_model")
      .trim()
      .isAlphanumeric()
      .withMessage('Model can only be numbers and letters'),

    body("inv_year")
      .trim()
      .isNumeric()
      .withMessage('Year has to be numeric'),

    body("inv_description")
      .trim(),

    body("inv_price")
      .trim()
      .isNumeric()
      .withMessage('Price must be a number'),

    body('inv_miles')
      .trim()
      .isNumeric()
      .withMessage('Miles must be a number'),

    body('inv_image')
      .trim()

  ]
}

validate.checkInventoryData = async (req, res, next) => {
  
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    classifications = await invModel.getClassifications()
    let form = await utilities.buildInventorynForm(classifications)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add to Inventory",
      form,
      nav,
      inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id
    })
    return
  }
  next()
}

  module.exports = validate