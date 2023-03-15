const User = require('../models/users')

function stringvalidator(string){
    if(string == undefined || string.length === 0)
    return true
    else return false
}

const signup = async(req,res)=>{
    try{
    const {name,email,password} = req.body;

    if(stringvalidator(name) || stringvalidator(email) || stringvalidator(password) )
       { return res.status(400).json({err:'Fields left empty'})}
   await User.create({name,email,password})
        res.status(201).json({message:'Success'})
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
                return res.status(400).json({message:'Email or Id is missing'})
            }
           const user = await User.findAll({where:{email}})
            if(user.length > 0){
                if(user[0].password === password){
                    res.status(200).json({success:true , message:"Login success"})
                }
                else{
                    return res.status(400).json({success:false,message:'Password is Incorrect'})
                }
            }
        }catch(err){
             res.status(500).json({message:err , success:false})   
        }
    }

    module.exports={
        signup,
        login
    }