const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul id="ul-header">'
  list += '<li class="li-header"><a id="nav-link" href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += '<li class="li-header">'
    list +=
      '<a id="nav-link" href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


Util.buildCarDisplay  = async function(data) {
  let display;

  display = '<section id="singleCarView">'
  display += '<div class="singleCarDetails">'
  display += '<h5>' + data.inv_year + '</h5>'
  display += '<img src=' + data.inv_image 
  +' alt="Image of '+ data.inv_make + ' ' + data.inv_model 
  +' on CSE Motors" />'
  display += '</div>'
  display += '<div class="singleCarDetails">'
  let formattedprice =  Number(data.inv_price).toLocaleString("en-US")
  display += '<p>Price: $' + formattedprice + '</p>'
  let formattedMiles = data.inv_miles.toLocaleString("en-US")
  display += '<p>Miles: ' + formattedMiles  + '</p>'
  display += '<p>Color: ' + data.inv_color  + '</p>'
  display += '</div>'
  display += '</section>'
  display += '<p> Description: ' + data.inv_description + '</p>'
  return display
}

Util.buildInventorynForm = async function(data){
  

  classification = data.rows
  let form = ""
  form += '<h1> Form </h1>'
  form += '<form action="addInventory" method="post">'

  form += '<select name="classification_id" id="dropdown">'
  classification.forEach(element => form += `<option value="${element.classification_id}">${element.classification_name}</option>`)
  form += '</select><br><br>'

  form += '<label for="name">Make:</label>'
  form += '<input type="text" name="inv_make" id="inv_make" required><br><br>'

  form += '<label for="name">Model:</label>'
  form += '<input type="text" name="inv_model" id="inv_model" required><br><br>'

  form += '<label for="name">Year:</label>'
  form += '<input type="text" name="inv_year" id="inv_year" required><br><br>'

  form += '<label for="name">Description:</label>'
  form += '<input type="text" name="inv_description" id="inv_description" required><br><br>'

  form += '<label for="name">Price:</label>'
  form += '<input type="text" name="inv_price" id="inv_price" required><br><br>'

  form += '<label for="name">Miles:</label>'
  form += '<input type="text" name="inv_miles" id="inv_miles" required><br><br>'

  form += '<label for="name">Color:</label>'
  form += '<input type="text" name="inv_color" id="inv_color" required><br><br>'

  form += '<label for="name">Image:</label>'
  form += '<input type="text" name="inv_image" id="inv_image" required><br><br>'

  form += '<input type="submit" value="Add">'

  form += '</form>'



  return form
}


module.exports = Util