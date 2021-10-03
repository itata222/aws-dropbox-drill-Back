const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        src: {
            type: String,
            required: [true, "Image source is required"],
        },
    },
    {
        timestamps: true,
    }
);


const Image = mongoose.model("Image", imageSchema);

module.exports = Image;