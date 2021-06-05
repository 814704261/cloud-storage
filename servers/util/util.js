const fs = require('fs')


// 创建文件夹
async function createDir(dir, recursive) {
    return await fs.promises.mkdir(dir, { recursive })
}


// 删除文件

async function deleteFile(paths) {
    let promise = [];
    for (let p of paths) {
        promise.push(await fs.promises.rmdir(p, { recursive: true }))
    }
    return Promise.all(promise)
}

exports.createDir = createDir
exports.deleteFile = deleteFile