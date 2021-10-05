const express = require('express');
const { deleteImage, getMyImages, logout, login, create } = require('../controlers/userControler');
const auth = require('../middlewares/auth');
const { uploadImageToS3, deleteImageFromS3, getImagesFromS3 } = require('../middlewares/s3-handlers');
const Image = require('../models/imageModel');
const { Readable } = require('stream');

const router = new express.Router();

router.post('/create',create)

router.post('/login',login)

router.post('/logout',auth, logout )

router.post('/upload-image',auth, uploadImageToS3, async (req, res) => {
    if (!req.file) {
        res.status(422).send({
            code: 422,
            message: "File not uploaded"
        });
    }

    const image = new Image({
        originalName: req.file.originalname,
        storageName: req.file.key.split("/")[1],
        bucket: process.env.S3_BUCKET,
        region: process.env.AWS_REGION,
        key: req.file.key
    });
    req.user.images=req.user.images.concat({image})

    try {
        await image.save();
        await req.user.save();
        res.send(image);
    } catch (err) {
        console.log(err);
    }
});

router.get('/get-image', getImagesFromS3, async (req, res) => {
    const imageName = req.query.name;
    const stream = Readable.from(req.imageBuffer);
    res.setHeader(
        'Content-Disposition',
        'inline; filename=' + imageName
    );

    stream.pipe(res);
});

router.delete('/delete-image',auth,deleteImageFromS3, deleteImage)

router.get('/get-my-images',auth, getMyImages)

module.exports = router;