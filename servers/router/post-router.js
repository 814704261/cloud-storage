const router = require('express').Router()
<<<<<<< HEAD
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const { deleteFiles } = require('../util/util')
const getFileTree = require('../util/getFileTree')

const MAXFILESIZE = 2 * 1024 * 1024 * 1024 //上传文件的大小限制为2G


router.post('/upload', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST")

    const form = formidable({
        multiples: true,
        uploadDir: path.resolve(__dirname, '../tmp'),
        keepExtensions: true,
        maxFileSize: MAXFILESIZE
    })

    form.parse(req, (err, fileds, files) => {
        if (err) {
            console.log(err)
            return next(err)
        }

        let context = fileds.path

        // 判断用户是否多文件上传
        if (!Array.isArray(files.files)) { // 不是多个文件
            let oldpath = files.files.path
            let newpath = path.resolve(context, files.files.name)
            return fs.promises.rename(oldpath, newpath)
                .then(result => {
                    res.send({
                        files: getFileTree(0, context),
                        succeed: true,
                        msg: null
                    })
                }).catch(err => {
                    res.send({
                        files: null,
                        succeed: false,
                        msg: err
                    })
                })
        }

        let deleteUpfilePath = []
        let decide = []
        for (let f of files.files) {
            deleteUpfilePath.push(f.path)
            let oldpath = f.path
            let newpath = path.resolve(context, f.name)
            let p = fs.promises.rename(oldpath, newpath)
            decide.push(p)
        }

        Promise.all(decide)
            .then(result => {
                res.send({
                    files: getFileTree(0, context),
                    succeed: true,
                    msg: null
                })
            })
            .catch(err => {
                console.log(err)
                res.send({
                    files: null,
                    succeed: false,
                    msg: err
                })
            })
    })

    form.on('error', (err) => {
        res.send({
            files: null,
            succeed: false,
            msg: err
        })
=======
const formidable = require('formidable');



router.post('/upload', (req, res) => {
    const form = formidable({
        multiples: true,
        uploadDir: '', //设置文件存储的位置
        keepExtensions: true,
        maxFileSize: 2048 * 1024 * 1024, // 上传文件大小设置为2G
    })
    form.parse(req, (err, fileds, files) => {

>>>>>>> 52b808384cc3e834cf5806d2e969f673e51dc354
    })
})



<<<<<<< HEAD


=======
>>>>>>> 52b808384cc3e834cf5806d2e969f673e51dc354
module.exports = router