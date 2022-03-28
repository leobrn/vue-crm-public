import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import messagePlugin from './utils/message.plugin'
import tooltipDirective from './directives/tooltip.directive'
import AppLoader from './components/App/AppLoader'
import localizeFilter from './filters/localize.filter'

import 'materialize-css/dist/js/materialize.min'
import 'materialize-css/dist/css/materialize.min.css'
import './assets/index.css'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import {createMetaManager} from 'vue-meta'

firebase.initializeApp({
    apiKey: 'apiKey',
    authDomain: 'authDomain',
    projectId: 'projectId',
    storageBucket: 'storageBucket',
    messagingSenderId: 'messagingSenderId',
    appId: 'appId'
})

let app

firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App)
            .use(store)
            .use(router)
            .use(messagePlugin)
            .use(createMetaManager())
            .component('AppLoader', AppLoader)
            .directive('tooltip', tooltipDirective)
        
        app.config.globalProperties.$filters = {
            localize(value) {
                return localizeFilter(value)
            }
        }

        app.mount('#app')
    }
})
