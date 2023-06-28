utilities = require('../utilities/index')
accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
      title: "Login",
      nav,
      errors: null,
      loggedIn: res.locals.loggedin
    })
  }


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    loggedIn: res.locals.loggedin
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

      // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  }


  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }


 /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildAccount(req, res, next) {
  const account_firstname = res.locals.accountData.account_firstname
  const account_type = res.locals.accountData.account_type

  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
    loggedIn: res.locals.loggedin,
    account_firstname,
    account_type
  })
}

async function logout(req,res, next){
  let nav = await utilities.getNav()
  
  delete res.locals.accountData
  res.clearCookie('jwt');
  
  req.flash("notice", "You have been logged out.")
  res.redirect('/')
}

async function buildUpdate (req, res, next) {
  // const loggedIn = res.locals.loggedin ? res.locals.loggedin : 0
  let nav = await utilities.getNav()
  account_firstname = res.locals.accountData.account_firstname 
  account_lastname = res.locals.accountData.account_lastname
  account_email = res.locals.accountData.account_email
  res.render('account/update',{
    title : 'Update Account',
    loggedIn: res.locals.loggedin,
    nav,
    account_firstname,
    account_lastname,
    account_email
  })

}

async function updateAccount(req, res, next){
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id} = req.body

  const result = await  accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  console.log(account_firstname,account_lastname,account_email);
  delete res.locals.accountData.account_firstname
  delete res.locals.accountData.account_lastname
  delete res.locals.accountData.account_email

  res.locals.accountData.account_firstname = account_firstname
  res.locals.accountData.account_lastname = account_lastname
  res.locals.accountData.account_email = account_email


 
  return res.redirect("/account/")

}

async function updatePassword(req,res,next){
  const{account_password, account_id} = req.body
  let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the password update.')
      res.status(500).render("account/account", {
        title: "Account Management",
        nav,
        errors: null,
      })
    }
  const result = accountModel.updatePassword(hashedPassword, account_id)

  res.redirect('/account')
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, logout, buildUpdate, updateAccount,updatePassword}