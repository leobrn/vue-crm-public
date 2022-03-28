<template>
    <div class="chat-message-list">
        <template v-for="msg in messages" :key="msg.id">
            <chat-message :size-avatar="sizeAvatar" :message="msg"/>
        </template>
    </div>
</template>

<script>
    import {ref} from 'vue'
    import AppAvatar from '../App/AppAvatar'
    import ChatMessage from './ChatMessage'

    export default {
        props: {
            messages: {
                type: Array,
                default: []
            }
        },
        setup() {
            const sizeAvatar = ref(window.innerWidth < 770 ? 40 : 50)

            return {
                sizeAvatar
            }
        },
        components: {
            AppAvatar,
            ChatMessage
        }
    }
</script>

<style scoped>
    .chat-message-list {
        grid-area: chat;
        align-self: end;
        display: flex;
        flex-direction: column-reverse;
        /*margin-bottom: 35px;*/
        /*height: 90vh;*/
    }

</style>