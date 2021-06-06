const express = require('express')
const app = express()
const router = require('./router/index')
const routerPost = require('./router/post-router.js')

app.use(router)
app.use(routerPost)


app.listen(1234, () => {
    console.log('服务器运行成功')
})