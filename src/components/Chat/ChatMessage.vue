<template>
    <div class="message-row" :class="classMsg">
        <div class="message-content">
            <app-avatar :size="sizeAvatar"
                        :name="message.userName"
                        :src="message?.userPhoto"
                        class="message-avatar"
                        v-if="isOtherMsg"
                        v-tooltip="message.userName"
            />
            <div class="message-text">{{message.text}}</div>
            <div class="message-time">{{message.date}}</div>
        </div>
    </div>
</template>

<script>
    import {ref} from 'vue'
    import AppAvatar from '../App/AppAvatar'

    export default {
        props: {
            message: {
                type: Object
            },
            sizeAvatar: {
                type: Number
            }
        },
        setup(props) {
            const classMap = {
                'other': 'other-message',
                'you': 'you-message'
            }

            const typeMsg = ref(props.message.type)
            const classMsg = ref(classMap[typeMsg.value])
            const isOtherMsg = ref(typeMsg.value === 'other')

            return {
                classMsg,
                isOtherMsg
            }
        },
        components: {
            AppAvatar
        }
    }
</script>

<style scoped>
    .message-row {
        display: grid;
        grid-template-columns: 70%;
        margin-bottom: 20px;
    }

    .message-content {
        display: grid;
    }

    .you-message {
        justify-content: end;
    }

    .you-message .message-content {
        justify-items: end;
    }

    .other-message {
        justify-content: start;
    }

    .other-message .message-content {
        justify-items: start;
        grid-template-columns: 48px 1fr;
        grid-column-gap: 15px;
    }

    .message-avatar {
        grid-row: span 2;
    }

    .message-text {
        padding: 9px 14px;
        margin-bottom: 5px;
    }

    .message-time {
        font-size: 14px;
    }

    .you-message .message-text {
        background-color: #03a9f4;
        color: #eee;
        border: 1px solid #03a9f4;
        border-radius: 14px 14px 0 14px;
    }

    .other-message .message-text {
        background-color: #eee;
        color: #111;
        border: 1px solid #eee;
        border-radius: 14px 14px 14px 0;
    }

    @media screen and (max-width: 760px) {

        .message-row {
            grid-template-columns: 90%;
        }

        .other-message .message-content {
            grid-column-gap: 5px;
        }
    }
</style>