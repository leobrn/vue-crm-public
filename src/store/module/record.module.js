import firebase from 'firebase'

export default {
    namespaced: true,
    actions: {
        async create({dispatch, commit}, record) {
            try {
                const uid = await dispatch('auth/getUid', null, {root: true})
                return await firebase.database().ref(`/users/${uid}/records`).push(record)
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        },
        async remove({dispatch, commit}, id) {
            try {
                const uid = await dispatch('auth/getUid', null, {root: true})
                await firebase.database().ref(`/users/${uid}/records/${id}`).remove()
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        },
        async fetchRecords({dispatch, commit}) {
            try {
                const uid = await dispatch('auth/getUid', null, {root: true})
                const records = (await firebase.database().ref(`/users/${uid}/records`).once('value')).val() || {}

                return Object.keys(records).map(key => ({...records[key], id: key}))
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        },
        async fetchRecordById({dispatch, commit}, id) {
            try {
                const uid = await dispatch('auth/getUid', null, {root: true})
                const record = (await firebase.database().ref(`/users/${uid}/records`).child(id).once('value')).val() || {}
                return {...record, id}
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        }
    }
}