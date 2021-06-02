import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        fileTree: {}
    },
    mutations: {
        setFileTree(state, payload) {
            state.fileTree = payload
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