import {createStore, createLogger} from 'vuex'
import auth from './module/auth.module'
import info from './module/info.module'
import category from './module/category.module'
import record from './module/record.module'
import chat from './module/chat.module'

const plugins = []

if (process.env.NODE_ENV === 'development') {
    // plugins.push(createLogger())
}

export default createStore({
    plugins,
    devtools: true,
    state: {
        error: null
    },
    mutations: {
        setError(state, error) {
            state.error = error
        },
        clearError(state) {
            state.error = null
        }
    },
    actions: {
        async fetchCurrency() {
            const key = process.env['VUE_APP_FIXER']
            //const res = await fetch(`http://data.fixer.io/api/latest?access_key=${key}&symbols=USD,EUR,RUB`)
            const res = await fetch('https://api.openrates.io/latest?symbols=USD,RUB')
            return await res.json()
        }
    },
    getters: {
        error(state) {
            return state.error
        }
    },
    modules: {
        auth,
        info,
        category,
        record,
        chat
    }
})
