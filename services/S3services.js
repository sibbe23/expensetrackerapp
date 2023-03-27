const AWS = require('aws-sdk')
const uploadToS3=(data,filename)=>{
    const BUCKET_NAME ='expensetracker0100';
    const IAM_USER_KEY='AKIAXRZMC3JI37TE5VFM'
    const IAM_USER_SECRET='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'

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
      
    }

    module.exports={
        uploadToS3
    }