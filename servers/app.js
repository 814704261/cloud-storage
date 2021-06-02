const express = require('express')
const app = express()
const getFileTree = require('./util/getFileTree')


app.get('/files', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.json(getFileTree(0, 'D:\\e-book'))
})



app.listen(1234, () => {
    console.log('服务器运行成功')
})