const fs = require('fs')
const path = require('path')
const crypto = require('crypto');
const { Promise } = require('mongoose');


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


// 判断多个文件是否存在返回文件详细信息，如果不存在就报错

function detailsFiles(paths) {
    let abc = []
    for (let p of paths) {
        if (!fs.existsSync(p)) return false

        let file = fs.statSync(p)
        let { ext, name } = path.parse(p)
        if (file.isFile()) {
            abc.push({
                path: p,
                name,
                ext,
                size: file.size,
                ctime: file.ctime,
                atime: file.atime,
                type: 'file'
            })
        } else {
            abc.push({
                path: p,
                name,
                size: file.size,
                ctime: file.ctime,
                atime: file.atime,
                type: 'directory',
                children: _getChildren(p)
            })
        }
    }
    return abc
}


function _getChildren(p) {
    let dir = fs.readdirSync(p, { withFileTypes: true })
    let abc = []
    for (let file of dir) {
        let filePath = path.resolve(p, file.name)
        if (file.isFile()) {
            let fileStats = fs.statSync(filePath)
            let { ext } = path.parse(filePath)
            abc.push({
                path: filePath,
                name: file.name,
                ctime: fileStats.ctime,
                atime: fileStats.atime,
                size: fileStats.size,
                type: 'file',
                ext
            })
        } else {
            let fileStats = fs.statSync(p)
            abc.push({
                path: filePath,
                name: file.name,
                size: fileStats.size,
                ctime: fileStats.ctime,
                atime: fileStats.atime,
                type: 'directory',
                children: _getChildren(filePath)
            })
        }
    }
    return abc
}


// 文件复制功能
async function copyFiles(paths, context) {
    let pm = []
    for (let p of paths) {
        let fileStats = await fs.promises.stat(p)
        if (fileStats.isFile()) {
            let { base } = path.parse(p)
            let newPath = path.resolve(context, base)
            pm.push(await fs.promises.link(p, newPath))
        } else {
            pm.push(await _copyFiles(p, context))
        }
    }
    return Promise.all(pm)
}

async function _copyFiles(dir, context) {
    let files = await fs.promises.readdir(dir, { withFileTypes: true })
    let pm = []

    let { name } = path.parse(dir)
    let destPath = path.resolve(context, name)
    await fs.promises.mkdir(destPath)

    for (let f of files) {
        let FilePath = path.resolve(dir, f.name)
        let target = path.resolve(destPath, f.name)
        if (f.isFile()) {
            pm.push(await fs.promises.link(FilePath, target))
        } else {
            pm.push(await _copyFiles(FilePath, destPath))
        }
    }

    return Promise.all(pm)
}


exports.createDir = createDir
exports.deleteFiles = deleteFiles
exports.deleteDir = deleteDir
exports.removes = removes
exports.detailsFiles = detailsFiles
exports.copyFiles = copyFiles