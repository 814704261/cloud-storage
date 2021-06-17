const express = require('express')
const app = express()
const routerGet = require('./router/index')
const routerPost = require('./router/post-router')
const path = require('path')

const HOSTNAME = 'localhost'

app.use(
    function hotlinking(req, res, next) {
        if (req.hostname != HOSTNAME) return res.send({ rubbish: '草泥马，想什么呢' })
        next()
    }
)

app.use(express.static(path.join(__dirname, '../dist')))
app.use(routerGet)
app.use(routerPost)


const serverOptions = {
    host: 'localhost',
    port: 1234,
    exclusive: true
}


const server = app.listen(serverOptions, () => {
    console.log('服务器运行成功')
})


process.on('SIGTERM', () => {
    debug('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        debug('HTTP server closed')
    })
})