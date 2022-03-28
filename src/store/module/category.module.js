import firebase from 'firebase'

export default {
    namespaced: true,
    actions: {
        async create({commit, dispatch}, category) {
            try {
                const uid = await dispatch('auth/getUid', null, {root: true})
                const newCategory = await firebase.database().ref(`/users/${uid}/categories`).push(category)
                return {...category, id: newCategory.key}
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        },
        async remove({commit, dispatch}, id) {
            try {
                const uid = await dispatch('auth/getUid', null, {root: true})
                const recordsAll = await dispatch('record/fetchRecords', null, {root: true})
                const paths = {}
                Object.keys(recordsAll).forEach(key => {
                    const record = ({...recordsAll[key]})
                    if (record.categoryId === id) {
                        const path = `/users/${uid}/records/${record.id}`
                        paths[path] = null
                    }
                })
                const ref = firebase.database().ref()
                ref.update(paths)
                await firebase.database().ref(`/users/${uid}/categories/${id}`).remove()
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        },
        async update({commit, dispatch}, {id, name, limit}) {
            try {
                const uid = await dispatch('auth/getUid', null, {root: true})
                await firebase.database().ref(`/users/${uid}/categories`).child(id).update({name, limit})
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        },
        async fetchCategories({commit, dispatch}) {
            try {
                const uid = await dispatch('auth/getUid', null, {root: true})
                const categories = (await firebase.database().ref(`/users/${uid}/categories`).once('value')).val() || {}

                return Object.keys(categories).map(key => ({...categories[key], id: key}))
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        },
        async fetchCategoryById({commit, dispatch}, id) {
            try {
                const uid = await dispatch('auth/getUid', null, {root: true})
                const category = (await firebase.database().ref(`/users/${uid}/categories`).child(id).once('value')).val() || {}
                return {...category, id}
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        }
    }
}