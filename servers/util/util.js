const fs = require('fs')
const path = require('path')
const crypto = require('crypto')


// 创建文件夹
async function createDir(dir, recursive) {
    return await fs.promises.mkdir(dir, { recursive })
}


// 删除文件

async function deleteDir(paths) {
    let promise = [];
    for (let p of paths) {
        promise.push(await fs.promises.rmdir(p, { recursive: true }))
    }
    return Promise.all(promise)
}


async function deleteFiles(paths) {
    let promise = []

    for (let path of paths) {
        promise.push(fs.promises.unlink(path))
    }
    return Promise.all(promise)
}

// 移动文件
async function removes(oldPath, newPath) {
    let promise = []
    for (let p of oldPath) {
        console.log(p)
        let base = path.parse(p).base
        let context = path.resolve(newPath, base)
        console.log(context)
        promise.push(fs.promises.rename(p, context))
    }
    return Promise.all(promise)
}





exports.createDir = createDir
exports.deleteFiles = deleteFiles
exports.deleteDir = deleteDir
exports.removes = removes