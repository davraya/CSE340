const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")  // Added this line
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get('/login',utilities.handleErrors(accountController.buildLogin))
router.get('/register', utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login request
router.post(
  "/login",
  // regValidate.loginRules(),
  // regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)


router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))


router.get('/logout', utilities.handleErrors(accountController.logout))

router.get('/update', utilities.handleErrors(accountController.buildUpdate))
router.post('/update', utilities.handleErrors(accountController.updateAccount))
router.post('/password-update', utilities.handleErrors(accountController.updatePassword))

module.exports = router