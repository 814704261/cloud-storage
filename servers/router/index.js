const router = require('express').Router()
const path = require('path')
const tar = require('tar')
const fs = require('fs')

const getFileTree = require('../util/getFileTree')
const { createDir, deleteDir, detailsFiles } = require('../util/util')
const sendEmail = require('../util/sendEmail')

const database = require('../DataBase/database')
const accountModel = require('../DataBase/accountSchema')
const verificationModel = require('../DataBase/verification')
const fileShareModel = require('../DataBase/fileshare')

const TARCWD = path.resolve(__dirname, '../USERDIR') // 用户下载打包文件的目录
const USERROOTDIR = path.resolve(__dirname, '../USERDIR')


//用户登录路由
router.get('/login', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    let { account, verification } = req.query

    new Promise((resolve, reject) => {
            // 验证用户的邮箱
            verificationModel.findOne({ account, verification }, (err, data) => {
                if (err) throw new Error(err)
                if (data) {
                    resolve(data) //验证通过
                } else {
                    reject() // 验证失败
                }
            })
        })
        .then((result) => {
            // 验证通过，检查用户是否是第一次登录
            new Promise((resolve, reject) => {
                    accountModel.findOne({ account }, (err, data) => {
                        if (err) throw new Error(err)
                        if (data) {
                            resolve(data) // 老用户
                        } else {
                            reject() // 新用户
                        }
                    })
                })
                .then(resolve => {
                    // 不是第一次登录的用户
                    res.send({
                        succeed: true,
                        msg: null
                    })

                }, () => {
                    // 第一次登录的用户，为其创建账号
                    new Promise((resolve, reject) => {
                            accountModel.create({ account }, (err, data) => {
                                if (err) reject(err)
                                return resolve(data)
                            })
                        })
                        .then(resolve => {
                            // 账号创建成功， 为其创建跟目录，然后返回数据

                            let rootDir = path.resolve(USERROOTDIR, account)

                            let p1 = createDir(rootDir, true)
                            let p2 = createDir(path.resolve(rootDir, '我的资源'), true)
                            let p3 = createDir(path.resolve(rootDir, '我的相册'), true)

                            Promise.all([p1, p2, p3]).then(result => {
                                res.send({
                                    succeed: true,
                                    msg: null
                                })
                            }).catch(err => {
                                res.send({
                                    succeed: true,
                                    msg: '服务器错误，请联系开发者'
                                })
                            })

                        }, (err) => {
                            // 账号创建失败， 向前端返回错误
                            console.log('账号创建失败')
                            res.send({
                                succeed: false,
                                msg: '服务器错误'
                            })
                        })
                })

        }, () => {
            //邮箱验证不通过，向前端返回错误
            res.send({
                succeed: false,
                msg: '验证码错误'
            })
        })
        .catch(err => {
            res.send({
                succeed: false,
                msg: '服务器错误'
            })
        })
})

// 用户获取目录树路由
router.get('/files', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log(req.query.account)
    let userDir = path.resolve(__dirname, '../USERDIR', req.query.account)
    res.json(getFileTree(userDir))
})

// 用户获取验证码路由
router.get('/getverification', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    let email = req.query.email
    let code = Math.floor(Math.random() * 1000000)

    verificationModel.deleteOne({ account: email }, err => {
        if (err) throw new Error(err)

        let createData = new Promise((resolve, reject) => {
            verificationModel.create({
                account: email,
                verification: code
            }, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })

        Promise.all([createData, sendEmail(email, code)]).then(result => {
            res.send({
                err: null,
                succeed: true
            })
        }).catch(err => {
            res.send({
                err,
                succeed: false
            })
        })
    })
})


//用户下载文件路由
router.get('/download', (req, res) => {

    res.set({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment;filename=download.tgz'
    })
    let { filepaths } = req.query
    tar.c({
        gzip: true,
        cwd: TARCWD
    }, filepaths).pipe(res)
})


// 用户创建文件夹路由
router.get('/createdir', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    let { context, name } = req.query
    createDir(path.resolve(context, name)).then((result) => {
            res.send({
                succeed: true,
                files: getFileTree(context),
                msg: null
            })
        })
        .catch((err) => {
            res.send({
                succeed: false,
                files: null,
                msg: '服务器错误，请联系开发者(file already exists)'
            })
            throw new Error(err)
        })
})

// 用户删除文件路由
router.get('/deletefile', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    let { context, filepaths } = req.query
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

// 获取首页
router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../dist/index.html'))
})

// 文件改名

router.get('/rename', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    let { filePath, name, context } = req.query
    fs.rename(filePath, path.resolve(context, name), (err, result) => {
        if (err) {
            return res.send({
                err,
                succeed: false,
                files: null
            })
        }

        res.send({
            err: null,
            succeed: true,
            files: getFileTree(context)
        })
    })

})

//获取分享文件路由
router.get('/getshare', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    let { link: guid, password } = req.query
    fileShareModel.findOne({
        guid,
        password
    }, (err, data) => {
        if (err) { // 如果报错就返回错误
            return res.send({
                files: null,
                err,
                succeed: false,
                exceed: null
            })
        }
        if (data == null) { // 如果没有找到就返回不成功
            return res.send({
                files: null,
                err: null,
                succeed: false,
                exceed: null
            })
        }
        let files = detailsFiles(data.files)
        if (!files) { // 如果分享的文件中某个文件不存在就当作是过期处理
            return res.send({
                files: null,
                err: null,
                succeed: false,
                exceed: true
            })
        }
        res.send({
            files: files,
            err: null,
            succeed: true,
            exceed: null
        })
    })
})





module.exports = router