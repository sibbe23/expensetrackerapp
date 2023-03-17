const User = require('../models/users')
const bcrypt = require('bcrypt')

function stringvalidator(string){
    if(string == undefined || string.length === 0)
    return true
    else return false
}

const signup = async(req,res)=>{
    try{
    const {name,email,password} = req.body;

    if(stringvalidator(name) || stringvalidator(email) || stringvalidator(password) )
       {
         return res.status(400).json({err:'Fields left empty'})
        }
        // const saltrounds = 10;
        bcrypt.hash(password,10,async(err,hash)=>{
            console.log(err)
            await User.create({name,email,password:hash})
            res.status(201).json({message:'Success'})
        })
        
 }

catch(err){
        res.status(500).json(err);
    }
}

const login = async(req,res)=>{
        try{
            const{email,password} = req.body;
            if(stringvalidator(email)||stringvalidator(password))
            {
                return res.status(400).json({message:'Email or Id is missing',success:false})
            }
           const user = await User.findAll({where:{email}})
            if(user.length > 0){
                bcrypt.compare(password,user[0].password , (err , result)=>{
                    if(err){
                        throw new Error;
                    } else if(result === true){
                        res.status(200).json({success:true,message:"Login success"})
                    }else{
                        return res.status(400).json({success:false,message:'Password is Incorrect'})
                    }})}
            else{
                return res.status(404).json({success:false,message:"No User found"})
            }
            }
        catch(err){
             res.status(500).json({message:err , success:false})   
        }
    }
    

    module.exports={
        signup,
        login
    }