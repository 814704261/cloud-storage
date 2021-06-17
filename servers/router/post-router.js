const router = require('express').Router()
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const tar = require('tar')
const crypto = require('crypto')


const getFileTree = require('../util/getFileTree')
const { removes, deleteDir, copyFiles } = require('../util/util')
const fileShareModel = require('../DataBase/fileshare')


const MAXFILESIZE = 2 * 1024 * 1024 * 1024 //上传文件的大小限制为2G
const TARCWD = path.resolve(__dirname, '../USERDIR') // 用户下载打包文件的目录
const LOGPATH = path.resolve(__dirname, '../tmp/cloud.log') //日志文件

let LOGSTRAM = fs.createWriteStream(LOGPATH, { flags: 'a+' })

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

        let time = new Date()
        LOGSTRAM.write('上传文件：' + '\t' + fileds.path + time.toString() + '\n')

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

        let time = new Date()
        LOGSTRAM.write('移动文件：' + '\t' + paths + '\t' + context + time.toString() + '\n')

        removes(paths, context)
            .then(result => {
                res.send({
                    err: null,
                    succeed: true
                })
            })
            .catch(err => {
                console.log(err)
                res.send({
                    err,
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

        let time = new Date()
        LOGSTRAM.write('文件分享' + '\t' + paths + '\t' + password + '\t' + time.toString() + '\n')

        let randomID = crypto.randomBytes(30).toString('hex')
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

// 文件复制功能（保存分享的文件）
router.post('/filecopy', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST")

    let form = formidable()
    form.parse(req, (err, fileld, files) => {
        let { paths, context } = fileld

        let time = new Date()
        LOGSTRAM.write('文件复制：' + '\t' + paths + '\t' + context + time.toString() + '\n')

        copyFiles(paths, context)
            .then(result => {
                res.send({
                    succeed: true,
                    err: null
                })
            })
            .catch(err => {
                console.log(err)
                res.send({
                    succeed: false,
                    err
                })
            })
    })
})


// 用户删除文件路由
router.post('/deletefile', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    let form = formidable()
    form.parse(req, (err, fileld, files) => {
        let { context, filepaths } = fileld

        let time = new Date()
        LOGSTRAM.write('删除文件：' + '\t' + context + '\t' + filepaths + time.toString() + '\n')

        deleteDir(filepaths).then(result => {
            res.send({
                succeed: true,
                files: getFileTree(context),
                msg: null
            })
        }).catch(err => {
            res.send({
                succeed: false,
                msg: err
            })
        })
    })
})

//用户下载文件路由
router.post('/download', (req, res) => {

    res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment;filename=download.gz'
    })

    let form = formidable()
    form.parse(req, (err, fileld, files) => {
        let { filepaths } = fileld
        console.log('下载文件路径', filepaths)
        let pathArray = []
        for (let p of filepaths) {
            pathArray.push(p.split('USERDIR' + path.sep)[1])
        }

        let time = new Date()
        LOGSTRAM.write('下载文件：' + '\t' + filepaths + '\t' + time.toString() + '\n')

        tar.c({
            gzip: true,
            cwd: TARCWD
        }, pathArray).pipe(res)
    })

})


module.exports = router