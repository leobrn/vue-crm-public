import firebase from 'firebase'
import dateFilter from '../../filters/date.filters'

export default {
    namespaced: true,
    state: {
        messages: [],
        newMessages: 0
    },
    getters: {
        messages: store => store.messages,
        newMessages: store => store.newMessages
    },
    mutations: {
        commuteMessages(state, msgs) {
            state.messages = msgs
        },
        countNewMessages(state, count) {
            state.newMessages = count
        }
    },
    actions: {
        async sendMessage({dispatch, commit, rootGetters}, text) {
            const uid = await dispatch('auth/getUid', null, {root: true})
            const userInfo = rootGetters['info/info']
            const date = {
                userID: uid,
                userName: userInfo.name,
                date: new Date().toJSON(),
                text
            }
            try {
                await firebase.database().ref('messages').push(date)
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        },
        async fetchMessage({dispatch, commit, rootGetters}) {
            const uid = await dispatch('auth/getUid', null, {root: true})
            const users = (await firebase.database().ref(`/users/`).once('value')).val() || {}
            const usersPhoto = Object.keys(users).map(key => {
                return {
                    id: key,
                    photo: users[key].info?.photo || '',
                    url: users[key].info?.urlPhoto || '',
                    lastDateReadMessage: new Date(users[key].info?.lastDateReadMessage) || null
                }
            })

            firebase.database().ref('messages').on('value', snapshot => {
                let countNewMessages = 0
                const lastDateReadMessage = new Date(rootGetters['info/info'].lastDateReadMessage) || null
                const data = snapshot.val() || {}
                const messages = []

                Object.keys(data).forEach(key => {
                    const idxPhoto = usersPhoto.findIndex(user => user.id === data[key].userID)
                    const urlPhoto = usersPhoto[idxPhoto].url
                    const dateSort = new Date(data[key].date)
                    const currentUser = uid === data[key].userID

                    messages.push({
                        id: key,
                        type: currentUser ? 'you' : 'other',
                        text: data[key].text,
                        date: dateFilter(data[key].date, 'datetime'),
                        userID: data[key].userID,
                        userName: data[key].userName,
                        userPhoto: urlPhoto,
                        dateSort: dateSort
                    })

                    if (lastDateReadMessage && lastDateReadMessage < dateSort && !currentUser) {
                        countNewMessages++
                    }

                    messages.sort((a, b) => {
                        return b.dateSort - a.dateSort
                    })

                    commit('countNewMessages', countNewMessages)
                    commit('commuteMessages', messages)
                })
            })
        },
        async updateDateReadMessage({dispatch, commit}) {
            try {
                const date = new Date().toJSON()
                await dispatch('info/update', {lastDateReadMessage: date}, {root: true})
            } catch (e) {
                commit('setError', e, {root: true})
                throw e
            }
        }
    }
}