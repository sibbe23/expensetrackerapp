const Expense = require('../models/expenses')
const User = require('../models/users')
const sequelize = require('../util/database')
const Userservices = require('../services/userservices')
const S3service = require('../services/S3services')

function stringvalidator(string){
    if(string == undefined || string.length === 0)
    return true
    else return false
}


const downloadexpense = async(req,res)=>{
    try{
    const expenses =await Userservices.getExpenses(req);
    console.log(expenses)
    const stringifiedExpenses = JSON.stringify(expenses)
    const userId = req.user.id
    
    const filename = `Expenses${userId}/${new Date()}.txt`
    const fileURL = await S3service.uploadToS3(stringifiedExpenses,filename)
    res.status(200).json({fileURL,success:true})
    }
    catch(err){
        console.log(err)
        res.status(500).json({fileURL:'',success:false,err:err})
    }
}

const addexpense = async(req,res)=>{
    const t = await sequelize.transaction()
    const {expenseamount,description,category,income} = req.body;
    if(stringvalidator(expenseamount) || stringvalidator(description) || stringvalidator(category))
    {
        return res.status(400).json({err:'Fields left empty'})
    }

    Expense.create({expenseamount,description,category,userId:req.user.id,income},{transaction:t}).then(expense =>{
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount) 
        const totalIncomes = Number(req.user.totalIncome) + Number(income)
        const totalSaving = Number(totalIncomes) - Number(totalExpense)
        console.log(totalExpense)
        User.update({totalExpenses:totalExpense,totalIncome:totalIncomes,totalSavings:totalSaving},{
            where:{id:req.user.id},
            transaction:t
        }) .then(async()=>{
            await t.commit();
                return res.status(200).json({expense:expense})
            })
            .catch(async(err)=>{
                await t.rollback()
                return res.status(500).json({success:false,error:err})
            })
        
    })
    .catch(async(err)=>{
        await t.rollback()
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

const deleteexpense = async(req,res)=>{
    const t = await sequelize.transaction()
    const expenseid = req.params.expenseid;
    if(stringvalidator(expenseid)){
     return  res.status(400).json({success:false,message:"Id not found"})
    }
    const expense = await Expense.findByPk(expenseid, { transaction: t });
    const users = await User.findByPk(req.user.id, { transaction: t });
    users.totalExpenses = users.totalExpenses - expense.expenseamount  ;
    users.totalIncome = users.totalIncome - expense.income;
    users.totalSavings = users.totalIncome - users.totalExpenses
    await t.commit()
    await users.save()


    Expense.destroy({where:{id:expenseid,userId:req.user.id}})
    .then(()=>{
       return res.status(200).json({success:true,message:"Delete Successful"})
    })
    .catch(err=>{
       console.log(err);
       return res.status(500).json({success:true,message:"failed"})
    })
   }
   
//    const pagination = async(req,res)=>{
//     const page = parseInt(req.query.page)
//     const limit = parseInt(req.query.limit)
//     const data = await Expense.findAll()
    
//     const startIndex = (page - 1)* limit
//     const endIndex  = page*limit
//     const results ={}
//     if(endIndex<data.length){
//     results.next={
//         page : page+1,
//         limit:limit
//      }
//     }
//     if(startIndex > 0){
//     results.previous ={
//         page:page-1,
//         limit:limit
//     }}

//  results.results = data.slice(startIndex,endIndex)
//     res.json(results)
    
//    }
const getAllExpenses = async (req, res, next) => {
    try {
      const str = req.query.page;
      const page = str ? Number(str.split("=")[0]) : 1;
      const ltd = str ? Number(str.split("=")[1]) : 10;
      let count = await Expense.count({ where: { userId: req.user.id } });
      const expenses = await Expense.findAll({
        where: { userId: req.user.id },
        offset: (page - 1) * ltd,
        limit: ltd,
      });
      return res.status(200).json({
        expenses,
        hasNextPage: ltd * page < count,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(count / ltd),
        currentPage: page,
      });
    } catch (err) {
      console.log(err);
    }
  };

module.exports = {
    addexpense,
    getexpenses,
    deleteexpense,
    downloadexpense,
    getAllExpenses
}