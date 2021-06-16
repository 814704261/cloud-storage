import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        fileTree: {}, //整个目录树  对象类型
        account: '', //用户账号
        spaceAble: '', //用户可用空间
        totalSpace: localStorage.getItem("space"), //用户总空间
        uploadQuest: [], // 用户上传任务队列
        downloadQuest: [] //用户下载任务队列
    },
    mutations: {
        setFileTree(state, payload) {
            state.fileTree = payload
        },
        changeFileTree(state, payload) {
            console.log('fileTree改变')
            if (state.fileTree.path == payload.path) {
                return state.fileTree = payload
            }

            function recursion(tree) {

                if (tree.path == payload.path) return tree = payload

                tree.children.forEach((value, index) => {
                    if (value.path == payload.path) return tree.children[index] = payload
                    if (value.type !== 'file') return recursion(tree.children[index])
                });

            }
            return recursion(state.fileTree)
        },
        setAccount(state, payload) {
            state.account = payload
        },
        setDownloadQuest(state, playload) {
            state.downloadQuest.push(playload)
        },
        changeDownloadQuest(state, playload) {
            for (let q of state.downloadQuest) {
                if (q.id == playload.id) {
                    return q = playload
                }
            }
        },
        deleteDownloadQuest(state, playload) {
            state.downloadQuest.forEach((value, index) => {
                if (value.id == playload.id) {
                    return state.downloadQuest.splice(index, 1)
                }
            })
        },
        addUploadQuest(state, playload) {
            state.uploadQuest.push(playload)
        },
        changeUploadQuest(state, playload) {
            for (let q of state.uploadQuest) {
                if (q.id == playload.id) {
                    return q = playload
                }
            }
        },
        cancelUploadQuest(state, playload) {
            state.uploadQuest.forEach((value, index) => {
                if (value.id == playload.id) {
                    return state.uploadQuest.splice(index, 1)
                }
            })
        },
        setTotalSpace(state, playload) {
            state.totalSpace = playload
        }
    },
    getters: {
        getFileTree(state, getters) {
            let tree = state.fileTree
            let children = state.fileTree.children.sort((a, b) => {
                if (a.type == 'file') {
                    return 1
                }
                return -1
            })
            tree.children = children
            return tree
        },
        getSpaceAble(state, getters) {
            let totalSpace = state.totalSpace * 1024 * 1024 * 1024
            return totalSpace - recursion(state.fileTree)

            function recursion(tree) {
                let space = 0

                for (let f of tree.children) {
                    if (f.type == 'file') {
                        space += f.size
                    } else {
                        return space += recursion(f)
                    }
                }
                return space
            }

        }
    },
    actions: {},
    modules: {}
})