const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./util/database')
const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require('./routes/premiumFeature')
const resetPasswordRoutes = require('./routes/resetpassword')
const dotenv = require('dotenv')
dotenv.config();

const cors = require('cors');
const Expense = require('./models/expenses');
const User = require('./models/users');
const Order = require('./models/orders')
const Forgotpassword = require('./models/forgotpassword');

app.use(bodyParser.json({ extended: true }));
app.use(cors())
app.use(express.json())

app.use('/user',userRoutes)
app.use('/expense',expenseRoutes)
app.use('/purchase',purchaseRoutes)
app.use('/premium',premiumFeatureRoutes)
app.use('/password', resetPasswordRoutes);

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)


User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync().then(res=>{
    app.listen(4000);
})
.catch(err=>{
    console.log(err);
})






const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY
const tranEmailApi = new Sib.TransactionalEmailsApi()
const sender ={
    email:'sibbe.sharpener@gmail.com',
    name:'Sharpener'
}
const receivers = [
    {
        email:'sibbe23@gmail.com'
    }
]
tranEmailApi.sendTransacEmail({
    sender,
    to:receivers,
    subject:'Hello there',
    textContent:`Welcome to Expense{{params.role}} tracker app`,
    //htmlContent:
    params:{role:'frontend'}
}).then(console.log)
.catch(console.log)
