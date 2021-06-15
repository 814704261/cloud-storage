const fs = require('fs')
const path = require('path')



function getDirTree(dir) {
    let dirstats = fs.statSync(dir)
    let Dir = {
        path: dir,
        name: path.basename(dir),
        type: 'directory',
        mtime: dirstats.mtime,
        ctime: dirstats.ctime,
        size: dirstats.size,
    }
    let files = fs.readdirSync(dir, { withFileTypes: true })
    Dir.children = files.map((value) => {
        let filePath = path.resolve(dir, value.name)
        if (value.isFile()) {
            let stats = fs.statSync(filePath)
            let { ext } = path.parse(filePath)
            return {
                path: filePath,
                name: value.name,
                mtime: stats.mtime,
                ctime: stats.ctime,
                size: stats.size,
                type: 'file',
                ext
            }
        } else {
            return getDirTree(filePath)
        }
    })
    return Dir
}

module.exports = getDirTree