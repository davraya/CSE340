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

router.get('/addClassification', utilities.verifyAccess, utilities.handleErrors(invController.buildAddClassification))

router.post('/addClassification', 
invValidate.classificationRules(),
invValidate.checkClassificationData,
utilities.handleErrors(invController.addClassification)
)

router.get('/addInventory', utilities.verifyAccess, invController.buildAddInventory)
router.post('/addInventory', 
// invValidate.InventoryRules(),
// invValidate.checkInventoryData,
utilities.handleErrors(invController.addInventory))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get('/edit/:inventoryId', utilities.handleErrors(invController.buildEditInventory))

router.post("/update/", 
// invValidate.InventoryRules(),
// invValidate.checkUpdateData,
utilities.handleErrors(invController.updateInventory))

router.get('/delete/:inventoryId', utilities.handleErrors(invController.buildDeleteInventory))

router.post('/delete/', utilities.handleErrors(invController.deleteInventory))

module.exports = router;