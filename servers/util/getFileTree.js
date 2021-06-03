const fs = require('fs')
const path = require('path')

function getFileTree(level, dir) {
    var filesNameArr = []
    let cur = 0
        // 用个hash队列保存每个目录的深度
    var mapDeep = {}
    mapDeep[dir] = 0
        // 先遍历一遍给其建立深度索引
    function getMap(dir, curIndex) {
        var files = fs.readdirSync(dir) //同步拿到文件目录下的所有文件名
        files.map(function(file) {
            //var subPath = path.resolve(dir, file) //拼接为绝对路径
            var subPath = path.join(dir, file) //拼接为相对路径
            var stats = fs.statSync(subPath) //拿到文件信息对象
                // 必须过滤掉node_modules文件夹
            if (file != 'node_modules') {
                mapDeep[file] = curIndex + 1
                if (stats.isDirectory()) { //判断是否为文件夹类型
                    return getMap(subPath, mapDeep[file]) //递归读取文件夹
                }
            }
        })
    }
    getMap(dir, mapDeep[dir])

    function readdirs(dir, folderName, myroot) {
        var stateDir = fs.statSync(dir)
        var result = { //构造文件夹数据
            path: dir,
            name: path.basename(dir),
            type: 'directory',
            mtime: stateDir.mtime,
            ctime: stateDir.ctime,
            size: stateDir.size,
            deep: mapDeep[folderName]
        }
        var files = fs.readdirSync(dir) //同步拿到文件目录下的所有文件名
        result.children = files.map(function(file) {
            //var subPath = path.resolve(dir, file) //拼接为绝对路径
            var subPath = path.join(dir, file) //拼接为相对路径
            var stats = fs.statSync(subPath) //拿到文件信息对象
            if (stats.isDirectory()) { //判断是否为文件夹类型
                return readdirs(subPath, file, file) //递归读取文件夹
            }
            return { //构造文件数据
                path: subPath,
                name: file,
                mtime: stats.mtime,
                ctime: stats.ctime,
                size: stats.size,
                type: 'file'
            }
        })
        return result //返回数据
    }
    filesNameArr.push(readdirs(dir, dir))
    return filesNameArr
}

module.exports = getFileTree