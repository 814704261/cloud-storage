import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        fileTree: {}, //整个目录树
        account: '', //用户账号
        uploadQuest: [], // 用户上传任务队列
        downloadQuest: [] //用户下载任务队列
    },
    mutations: {
        setFileTree(state, payload) {
            state.fileTree = payload
        },
        changeFileTree(state, payload) {

            if (state.fileTree.path == payload.path) {
                return state.fileTree.children = payload.children
            }
            bianli(state.fileTree.children)

            function bianli(tree) {
                for (let files of tree) {
                    if (files.path == payload.path) {
                        return files.children = payload.children
                    } else {
                        return bianli(files.children)
                    }
                }
            }
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
        }
    },
    actions: {},
    modules: {}
})