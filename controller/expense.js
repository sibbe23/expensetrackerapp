const Expense = require('../models/expenses')
const User = require('../models/users')
const sequelize = require('../util/database')


function stringvalidator(string){
    if(string == undefined || string.length === 0)
    return true
    else return false
}

const addexpense = (req,res)=>{
    const {expenseamount,description,category} = req.body;
    if(stringvalidator(expenseamount) || stringvalidator(description) || stringvalidator(category))
    {
        return res.status(400).json({err:'Fields left empty'})
    }

    Expense.create({expenseamount,description,category,userId:req.user.id}).then(expense =>{
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount)
        console.log(totalExpense)
        User.update({totalExpenses:totalExpense},{
            where:{id:req.user.id}
        }) .then(async()=>{
                 res.status(200).json({expense:expense})
            })
            .catch(async(err)=>{
                return res.status(500).json({success:false,error:err})
            })
        
    })
    .catch(err=>{
        console.log(err)
        return res.status(500).json({success :false,error:err})
    })
}

const getexpenses = (req,res)=>{

    Expense.findAll({where :{userId:req.user.id}}).then(expenses=>{
        return res.status(200).json({expenses,success:true})
    })
    .catch(err=>{
        console.log(err)
        return res.status(500).json({error:err,success:false})
    })
}

const deleteexpense = (req,res)=>{
 const expenseid = req.params.expenseid;
 if(stringvalidator(expenseid)){
  return  res.status(400).json({success:false,message:"Id not found"})
 }
 Expense.destroy({where:{id:expenseid,userId:req.user.id}})
 .then(()=>{
    return res.status(200).json({success:true,message:"Delete Successful"})
 })
 .catch(err=>{
    console.log(err);
    return res.status(500).json({success:true,message:"failed"})
 })
}

module.exports = {
    addexpense,
    getexpenses,
    deleteexpense
}