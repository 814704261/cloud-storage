const mongoose = require('mongoose')


const accountSchema = mongoose.Schema({
    account: {
        type: String,
        index: true,
        unique: true
    },
    space: {
        type: Number,
        default: 1
    },
    createTime: { type: Date, default: Date.now }
});



module.exports = mongoose.model('account', accountSchema)