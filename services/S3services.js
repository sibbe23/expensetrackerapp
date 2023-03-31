const AWS = require('aws-sdk')
require('dotenv').config()
const uploadToS3=(data,filename)=>{
    try{
    const BUCKET_NAME =process.env.AWS_USER_BUCKET;
    const IAM_USER_KEY=process.env.AWS_USER_KEY
    const IAM_USER_SECRET=process.env.AWS_USER_SECRET

    let s3bucket = new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    })
    
        var params = {
            Bucket:BUCKET_NAME,
            Key : filename,
            Body:data,
            ACL:'public-read'
        }
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log('Something went wrong',err)
                    reject(err)
                }
                else{
                    resolve(s3response.Location)
                }
            })
        })
      
    }catch(err){
        console.log(err)
        return res.status(500).json({err,message:"Something went wrong"})
    }
}

    module.exports={
        uploadToS3
    }