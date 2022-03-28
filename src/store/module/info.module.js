import firebase from 'firebase'

export default {
    namespaced: true,
    state: {
        info: {}
    },
    mutations: {
        setInfo(state, info) {
            state.info = info
        },
        clearInfo(state) {
            state.info = {locale: state.info.locale}
        }
    },
    actions: {
        async fetchInfo({dispatch, commit}) {
            try {
                const uid = await dispatch('auth/getUid', null, {root: true})
                const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
                commit('setInfo', info)
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        },
        async update({dispatch, commit, getters}, toUpdate) {
            try {
                const uid = await dispatch('auth/getUid', null, {root: true})
                if (!uid) {
                    return
                }
                const updateData = {...getters.info, ...toUpdate}
                await firebase.database().ref(`/users/${uid}/info`).update(updateData)
                commit('setInfo', updateData)
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        },
        async uploadFile({dispatch, commit}, file) {
            try {
                const storageRef = firebase.storage().ref()
                const path = 'images/' + file.name
                const imagesRef = storageRef.child(path)
                const response = await imagesRef.put(file)
                const url = await response.ref.getDownloadURL()
                await dispatch('update', {photo: path, urlPhoto: url})
                return url
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        },
        async deleteFile({dispatch, commit, getters}) {
            try {
                const path = getters.info.photo
                if (path) {
                    const storageRef = firebase.storage().ref()
                    const imagesRef = storageRef.child(path)
                    await imagesRef.delete()
                    await dispatch('update', {photo: '', urlPhoto: ''})
                }
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        },
        async getFile({commit, getters}) {
            try {
                const path = getters.info.photo
                if (path) {
                    const storageRef = firebase.storage().ref()
                    const imagesRef = storageRef.child(path)
                    const url = await imagesRef.getDownloadURL()
                    return url
                }
                return null
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        }
    },
    getters: {
        info: store => store.info
    }
}