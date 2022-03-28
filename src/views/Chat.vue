<template>
    <app-loader v-if="loading"/>
    <div class="chat-container"
         :style="{
            'min-height': heightChat + 'px'
         }"
         v-else
    >
        <chat-messages :messages="messages"/>
        <chat-form :scrollIntoView="scrollIntoView"/>
    </div>
</template>

<script>
    import {ref, computed, watch, onMounted, onBeforeUnmount} from 'vue'
    import {useStore} from 'vuex'
    import AppLoader from '../components/App/AppLoader'
    import ChatForm from '../components/Chat/ChatForm'
    import ChatMessages from '../components/Chat/ChatMessages'

    export default {
        setup() {
            const store = useStore()
            const loading = ref(true)
            const messages = computed(() => store.getters['chat/messages'])
            const scrollIntoView = ref(0)
            const heightChat = ref(Math.max(window.innerHeight, 850))

            onMounted(() => {
                loading.value = false
                store.commit('chat/countNewMessages', 0)
            })

            watch(messages, () => {
                scrollIntoView.value++
                store.commit('chat/countNewMessages', 0)
            })

            onBeforeUnmount(async () => {
                try {
                    await store.dispatch('chat/updateDateReadMessage')
                } catch (e) {
                }
            })

            return {
                loading,
                messages,
                scrollIntoView,
                heightChat
            }
        },
        components: {
            AppLoader,
            ChatForm,
            ChatMessages
        }
    }
</script>

<style scoped>
    .chat-container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        grid-template-areas: "chat chat chat chat" "chat chat chat chat" "form form form form";
        align-items: end;
        /*max-height: 800px;*/
        width: 100%;
        /*height: 90vh;*/
    }

    @media screen and (max-width: 760px) {

        .chat-container {
            /*margin-top: 70px;*/
        }

        .app-page {
            padding-bottom: 0;
        }

    }
</style>

<style>
    .app-page {
        padding-bottom: 0;
    }
</style>