const Image = require("../models/imageModel");
const User = require("../models/userModel");

exports.deleteImage = async (req, res) => {
    const id=req.body.id
    try {
        const imageObj = await Image.findByIdAndDelete(id);
        if (!imageObj) {
            res.status(404).send({
                status:404,
                message:'image Not Found'
            })
        }
        req.user.images=req.user.images.filter((image)=>image.image!==id)
        await req.user.save();
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
        const userPopulated =await req.user.populate('images.image').execPopulate();
        res.send(userPopulated.images)
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
exports.create = async (req, res) => {
    try {
        const user=new User(req.body)
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: 'something went wrong'
        })
    }
}
