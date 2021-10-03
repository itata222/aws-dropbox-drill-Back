const express = require('express');
const { uploadImage, deleteImage, getMyImages, logout, login } = require('../controlers/userControler');
const auth = require('../middlewares/auth');

const router = new express.Router();

router.post('/login',login)

router.post('/logout',auth, logout )

router.post('/upload-image',auth, uploadImage)

router.delete('/delete-image',auth, deleteImage)

router.get('/get-my-images',auth, getMyImages)

module.exports = router;