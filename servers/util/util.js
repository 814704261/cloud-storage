const fs = require('fs')

async function createDir(dir, recursive) {
    return await fs.promises.mkdir(dir, { recursive })
}


exports.createDir = createDir