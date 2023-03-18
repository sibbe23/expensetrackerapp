const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./util/database')
const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expense')

const cors = require('cors');
const Expense = require('./models/expenses');
const User = require('./models/users');

app.use(bodyParser.json({ extended: true }));
app.use(cors())
app.use(express.json())

app.use('/user',userRoutes)
app.use('/expense',expenseRoutes)

User.hasMany(Expense)
Expense.belongsTo(User)

sequelize.sync().then(res=>{
    app.listen(4000);
})
.catch(err=>{
    console.log(err);
})