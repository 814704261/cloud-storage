const router = require('express').Router()
const path = require('path')
const fs = require('fs')

const getFileTree = require('../util/getFileTree')
const { createDir, detailsFiles } = require('../util/util')
const sendEmail = require('../util/sendEmail')

const database = require('../DataBase/database')
const accountModel = require('../DataBase/accountSchema')
const verificationModel = require('../DataBase/verification')
const fileShareModel = require('../DataBase/fileshare')

const USERROOTDIR = path.resolve(__dirname, '../USERDIR') //用户文件根目录
const LOGPATH = path.resolve(__dirname, '../tmp/cloud.log') //日志文件

let LOGSTRAM = fs.createWriteStream(LOGPATH, { flags: 'a+' })




// 获取首页
router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../dist/index.html'))
})

//用户登录路由
router.get('/login', (req, res) => {

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
                        msg: null,
                        resolve
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
                                    msg: null,
                                    resolve,
                                    err: null
                                })
                            }).catch(err => {
                                res.send({
                                    succeed: true,
                                    err,
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
                .finally(() => {
                    let time = new Date()
                    LOGSTRAM.write('登录成功：' + account + '\t' + time.toString() + '\n')
                })

        }, () => {
            //邮箱验证不通过，向前端返回错误
            let time = new Date()
            LOGSTRAM.write('登录失败：' + account + '\t' + time.toString() + '验证码不通过' + '\n')

            res.send({
                succeed: false,
                msg: '验证码错误'
            })
        })
        .catch(err => {
            let time = new Date()
            LOGSTRAM.write('登录失败：' + account + '\t' + time.toString() + JSON.stringify(err) + '\n')

            res.send({
                succeed: false,
                msg: '服务器错误'
            })
        })
})

// 用户获取目录树路由
router.get('/files', (req, res) => {
    let time = new Date()
    LOGSTRAM.write('获取目录树：' + req.query.account + '\t' + time.toString() + '\n')

    let userDir = path.resolve(USERROOTDIR, req.query.account)

    let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (!reg.test(req.query.account)) {
        return res.json({
            files: null,
            err: '账号目录不存在',
            succeed: false
        })
    }

    if (fs.existsSync(userDir)) {
        return res.json({
            files: getFileTree(userDir),
            err: null,
            succeed: true
        })
    }

    accountModel.deleteOne({ account: req.query.account }, (err, doc) => {
        if (err) throw new Error(err)
        res.json({
            files: null,
            err: '账号目录不存在',
            succeed: false
        })
    })


})

// 用户获取验证码路由
router.get('/getverification', (req, res) => {

    let email = req.query.email
    let code = Math.floor(Math.random() * 1000000)

    let time = new Date()
    LOGSTRAM.write('获取验证码：' + email + '\t' + time.toString() + '\n')

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



// 用户创建文件夹路由
router.get('/createdir', (req, res) => {

    let { context, name } = req.query

    let time = new Date()
    LOGSTRAM.write('创建文件夹：' + context + '\t' + name + '\t' + time.toString() + '\n')

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


// 文件重命名
router.get('/rename', (req, res) => {
    let { filePath, name, context } = req.query

    let time = new Date()
    LOGSTRAM.write('文件重命名：' + filePath + '\t' + name + '\t' + time.toString() + '\n')

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

    let { link: guid, password, shareEmail } = req.query

    let time = new Date()
    LOGSTRAM.write('获取分享文件：' + shareEmail + '\t' + 'guid：' + guid + '\t' + time.toString() + '\n')

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

// 用户获取缩略图路由
router.get('/proview-img', (req, res) => {
    res.sendFile(req.query.path)
})


module.exports = router