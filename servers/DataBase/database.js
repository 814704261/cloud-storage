const mongoose = require('mongoose')

let db = mongoose.connect('mongodb://localhost/cloud', {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
})

db.then((result) => {
    console.log('数据库打开成功')
}).catch(err => {
    throw new Error(err)
})