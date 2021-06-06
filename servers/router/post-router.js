const router = require('express').Router()
const formidable = require('formidable');



router.post('/upload', (req, res) => {
    const form = formidable({
        multiples: true,
        uploadDir: '', //设置文件存储的位置
        keepExtensions: true,
        maxFileSize: 2048 * 1024 * 1024, // 上传文件大小设置为2G
    })
    form.parse(req, (err, fileds, files) => {

    })
})



module.exports = router