const express = require('express')

const expenseController = require('../controller/expense')

const router = express.Router();

router.post('/addexpense',expenseController.addexpense)

router.get('/getexpenses',expenseController.getexpenses)

router.delete('/deleteexpense/:expenseid',expenseController.deleteexpense)

module.exports = router;