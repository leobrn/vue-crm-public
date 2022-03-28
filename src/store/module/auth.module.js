import firebase from 'firebase'

export default {
    namespaced: true,
    actions: {
        async login({commit, dispatch}, {email, password}) {
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password)
            } catch (e) {
                commit('setError', e, {root: true})
                throw new Error()
            }
        },
        async register({dispatch, commit}, {email, password, name}) {
            try {
                await firebase.auth().createUserWithEmailAndPassword(email, password)
                const uid = await dispatch('getUid')
                await firebase.database().ref(`/users/${uid}/info`).set({
                    bill: 10000,
                    name,
                    locale: 'ru-RU',
                    photo: ''
                })
            } catch (e) {
                commit('setError', e, {root: true})
                throw new Error()
            }
        },
        async reset({dispatch, commit}, email) {
            try {
                await firebase.auth().sendPasswordResetEmail(email)
            } catch (e) {
                commit('setError', e, {root: true})
                throw new Error()
            }
        },
        getUid() {
            const user = firebase.auth().currentUser
            return user ? user.uid : null
        },
        async logout({commit}) {
            await firebase.auth().signOut()
            commit('info/clearInfo', null, {root: true})
        }
    }
}