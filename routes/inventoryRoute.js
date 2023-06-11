// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index");  // Added this line

const invValidate = require("../utilities/inventory-validation")



// Route to build inventory by classification view
router.get("/type/:classificationId",utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId))

router.get('/', utilities.handleErrors(invController.buildManagement))

router.get('/addClassification', utilities.handleErrors(invController.buildAddClassification))
router.post('/addClassification', 
invValidate.classificationRules(),
invValidate.checkClassificationData,
utilities.handleErrors(invController.addClassification)
)

router.get('/addInventory', invController.buildAddInventory)
router.post('/addInventory', 
// invValidate.InventoryRules(),
// invValidate.checkInventoryData,
utilities.handleErrors(invController.addInventory))



module.exports = router;