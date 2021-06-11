const router = require('express').Router()
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const getFileTree = require('../util/getFileTree')
const { removes } = require('../util/util')
const fileShareModel = require('../DataBase/fileshare')
const crypto = require('crypto')

const MAXFILESIZE = 2 * 1024 * 1024 * 1024 //上传文件的大小限制为2G

//上传文件路由
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
                        files: getFileTree(context),
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
                    files: getFileTree(context),
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
    })
})

//移动文件路由
router.post('/remove', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST")

    let form = formidable()
    form.parse(req, (err, fileld, files) => {
        let { paths, context } = fileld

        removes(paths, context)
            .then(result => {
                res.send({
                    err: null,
                    files: getFileTree(context),
                    succeed: true
                })
            })
            .catch(err => {
                console.log(err)
                res.send({
                    err,
                    files: null,
                    succeed: false
                })
            })
    })
})

// 文件分享路由
router.post('/fileshare', (req, res) => {
    let form = formidable()
    form.parse(req, (err, fields, files) => {
        let { paths, password } = fields
        console.log(fields)
        let randomID = crypto.randomBytes(16).toString('hex')
        fileShareModel.create({
            guid: randomID,
            password,
            files: paths
        }, (err, doc) => {
            if (err) {
                return res.send({
                    err,
                    succeed: false,
                    randomID: null,
                    password: null
                })
            }
            res.send({
                err: null,
                succeed: true,
                password,
                randomID
            })
        })
    })
})


module.exports = router