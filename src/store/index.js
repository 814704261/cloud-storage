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
    actions: {},
    modules: {}
})