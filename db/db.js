const mongoose = require('mongoose');

try {
    const client = mongoose.connect('mongodb+srv://admin:admin@cluster0.vdzea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        // useFindAndModify: true
    })
    console.log("Database connected")
} catch (e) {
    console.log(e)
}

module.exports = mongoose