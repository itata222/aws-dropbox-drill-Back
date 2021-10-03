const Image = require("../models/imageModel");
const User = require("../models/userModel");

exports.uploadImage = async (req, res) => {
    console.log(req.body)
    try {
        const image = new Image(req.body);
        if (!image) {
            throw new Error('no image added')
        }
        await image.save();
        res.send(image)
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: error
        })
    }
}
exports.deleteImage = async (req, res) => {
    const id=req.query._id
    try {
        const imageObj = await Image.findByIdAndDelete(id);
        if (!imageObj) {
            res.status(404).send({
                status:404,
                message:'image Not Found'
            })
        }
        res.send(imageObj)
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: error.message
        })
    }
}
exports.getMyImages = async (req, res) => {
    try {
        const images = await Image.find({});
        if (!images) {
            return res.status(404).send({
                status:400,
                message:'Bad request'
            })
        }
        res.send(images)
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: error.message
        })
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findUserbyEmailAndPassword(email, password);
        const token = await user.generateAuthToken();
        res.send({ user, token })
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: e.message,
        })
    }
}
exports.logout = async (req, res) => {
    const user = req.user;
    try {
        user.tokens = user.tokens.filter((tokenDoc) => tokenDoc.token !== req.token)
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: 'something went wrong'
        })
    }
}
