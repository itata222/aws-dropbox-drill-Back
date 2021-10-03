const mongoose = require('mongoose')

mongoose.connect(process.env.DROPBOX_MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});