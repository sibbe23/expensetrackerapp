const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./util/database')
const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require('./routes/premiumFeature')
const dotenv = require('dotenv')
dotenv.config();

const cors = require('cors');
const Expense = require('./models/expenses');
const User = require('./models/users');
const Order = require('./models/orders')

app.use(bodyParser.json({ extended: true }));
app.use(cors())
app.use(express.json())

app.use('/user',userRoutes)
app.use('/expense',expenseRoutes)
app.use('/purchase',purchaseRoutes)
app.use('/premium',premiumFeatureRoutes)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

sequelize.sync().then(res=>{
    app.listen(4000);
})
.catch(err=>{
    console.log(err);
})