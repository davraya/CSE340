const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){

  const loggedIn = res.locals.accountData ? res.locals.loggedin : 0
  const nav =  await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("index", {
    title: "Home", 
    nav,
    loggedIn
  })
}

module.exports = baseController