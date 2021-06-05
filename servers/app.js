const express = require('express')
const app = express()
const router = require('./router')


app.use(router)

app.listen(1234, () => {
    console.log('服务器运行成功')
})