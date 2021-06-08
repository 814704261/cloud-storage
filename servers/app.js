const express = require('express')
const app = express()
const routerGet = require('./router/index')
const routerPost = require('./router/post-router')
const path = require('path')


app.use(express.static(path.join(__dirname, '../dist')))
app.use(routerGet)
app.use(routerPost)

app.listen(1234, () => {
    console.log('服务器运行成功')
})