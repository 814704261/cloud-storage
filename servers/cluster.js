const cluster = require('cluster')
const numCPUs = 5

if (cluster.isMaster) {
    console.log(`主进程 ${process.pid} 正在运行`)

    // 衍生工作进程。
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
        require('./app')
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`)
    })

} else {
    console.log(`工作进程 ${process.pid} 已启动`);
}