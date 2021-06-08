const express = require('express')
const app = express()
<<<<<<< HEAD
const routerGet = require('./router/index')
const routerPost = require('./router/post-router')
const path = require('path')


app.use(express.static(path.join(__dirname, '../dist')))
app.use(routerGet)
app.use(routerPost)
=======
const router = require('./router/index')
const routerPost = require('./router/post-router.js')

app.use(router)
app.use(routerPost)

>>>>>>> 52b808384cc3e834cf5806d2e969f673e51dc354

app.listen(1234, () => {
    console.log('服务器运行成功')
})