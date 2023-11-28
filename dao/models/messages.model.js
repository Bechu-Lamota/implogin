const mongoose = require('mongoose')

const massagesSchema = mongoose.Schema({
    user: String, 
    message: {
        type: String,
        unique: true
    }, 
    timerecord: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('messages', massagesSchema)