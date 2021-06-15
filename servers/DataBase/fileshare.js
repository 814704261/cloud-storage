const mongoose = require('mongoose')


let fileshareSchame = mongoose.Schema({
    guid: {
        type: String,
        index: true,
        unique: true
    },
    password: {
        type: String
    },
    files: {
        type: Array
    },
    expireAt: {
        type: Date,
        default: Date.now
    }
})

fileshareSchame.index({ expireAt: 1 }, { expireAfterSeconds: 86400 }) // 一天过期


module.exports = mongoose.model('fileshare', fileshareSchame)