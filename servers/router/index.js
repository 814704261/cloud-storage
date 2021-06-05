let router = require('express').Router()

const path = require('path')
const tar = require('tar')

const getFileTree = require('../util/getFileTree')
const database = require('../DataBase/database')
const accountModel = require('../DataBase/accountSchema')
const verificationModel = require('../DataBase/verification')
const sendEmail = require('../util/sendEmail')
const { createDir, deleteFile } = require('../util/util')

const TARCWD = path.resolve(__dirname, '../USERDIR') // 用户下载打包文件的目录


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

                            let rootDir = path.resolve(__dirname, './USERDIR', account)

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

// 用户获取目录路由
router.get('/files', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    let userDir = path.resolve(__dirname, '../USERDIR', req.query.account)

    res.json(getFileTree(0, userDir))
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
        'Content-Disposition': 'attachment;filename=download.tar.gzip'
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
                files: getFileTree(0, context),
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

router.get('/deletefile', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    let { context, filepaths } = req.query
    deleteFile(filepaths).then(result => {
        res.send({
            succeed: true,
            files: getFileTree(0, context),
            msg: null
        })
    }).catch(err => {
        res.send({
            succeed: false,
            msg: err
        })
    })
})
module.exports = router