const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./util/database')
const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expense')

const cors = require('cors');

app.use(bodyParser.json({ extended: true }));
app.use(cors())

app.use('/user',userRoutes)
app.use('/expense',expenseRoutes)

sequelize.sync().then(res=>{
    app.listen(4000);
})
.catch(err=>{
    console.log(err);
})