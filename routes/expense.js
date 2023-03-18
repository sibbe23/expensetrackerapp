const express = require('express')

const expenseController = require('../controller/expense')

const userauthenticate = require('../middleware/auth')

const router = express.Router();

router.post('/addexpense',userauthenticate.authenticate,expenseController.addexpense)

router.get('/getexpenses',userauthenticate.authenticate ,expenseController.getexpenses)

router.delete('/deleteexpense/:expenseid',userauthenticate.authenticate,expenseController.deleteexpense)

module.exports = router;