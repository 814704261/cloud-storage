const mongoose = require('mongoose')


const accountSchema = mongoose.Schema({
    account: {
        type: String,
        index: true,
        unique: true
    },
    createTime: { type: Date, default: Date.now }
});



module.exports = mongoose.model('account', accountSchema)