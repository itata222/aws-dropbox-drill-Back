   
const AWS = require('aws-sdk');
const multer = require('multer');
const s3Storage = require('multer-s3');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({ region: process.env.AWS_REGION,accessKeyId:process.env.AWS_ACCESS_KEY_ID,secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY });
const bucket = process.env.S3_BUCKET;

const fileStorage = multerS3({
    s3,
    acl: 'private',//'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: "inline",
    bucket,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, callback) => {
        const fileName = `${req.user._id}/${new Date().getTime()}-${file.originalname}`;
        callback(null, fileName);
    }
});

const uploadImageToS3 = multer({ storage: fileStorage }).single("image");


const getImagesFromS3=async(req,res,next)=>{
    const Key=req.query.key;
    try {
        const { Body } = await s3.getObject({
            Key,
            Bucket: bucket
        }).promise();

        req.imageBuffer = Body;
        next()
    } catch (e) {
        console.log(e)
    }
}

const deleteImageFromS3=async(req,res,next)=>{
    console.log(req.body)
    const params = { Bucket:bucket , Key: req.body.key };

    s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);  // error
        else     console.log('deleted');                 // deleted
    });

    next();
}

module.exports={
    uploadImageToS3,
    getImagesFromS3,
    deleteImageFromS3
}