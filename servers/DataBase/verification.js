const mongoose = require('mongoose')


let verificationSchema = mongoose.Schema({
    account: {
        type: String
    },
    verification: {
        type: Number
    },
    expireAt: {
        type: Date,
        default: Date.now
    }
})

verificationSchema.index({ expireAt: 1 }, { expireAfterSeconds: 180 })


module.exports = mongoose.model('verification', verificationSchema)