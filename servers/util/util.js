const { rejects } = require('assert');
const fs = require('fs')


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
        promise.push(new Promise((resolve, reject) => {
            fs.unlink(path, (err, data) => {
                if (err) reject(err)
                resolve(data)
            })
        }))
    }
    return Promise.all(promise)
}

exports.createDir = createDir
exports.deleteFiles = deleteFiles
exports.deleteDir = deleteDir