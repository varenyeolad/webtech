const mongoose = require('mongoose')

//Schema of DB
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

const User = mongoose.model('User', userSchema)
module.exports = User;