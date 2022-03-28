<template>
    <form class="chat-form" @submit.prevent="onSubmit">
        <div class="input-field">
            <input
                    id="message"
                    type="text"
                    autocomplete="off"
                    v-model="text"
                    @blur="mBlur"
            >
            <label for="message" :class="{'active':text && text.length>0}">
                {{$filters.localize('EnterMessage')}}
            </label>
        </div>
        <button
                class="btn waves-effect waves-light auth-submit"
                type="submit"
        >
            <span class="hide-on-small-only">{{$filters.localize('Send')}}</span>
            <i class="material-icons right">send</i>
        </button>
    </form>
    <div ref="chatForm"></div>
</template>

<script>
    import {useChatForm} from '../../use/chat-form'

    export default {
        props: {
            scrollIntoView: {
                type: Number
            }
        },
        setup(props) {

            return {
                ...useChatForm(props)
            }
        }
    }
</script>

<style scoped>
    .chat-form {
        grid-area: form;
        align-self: end;
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        align-items: center;
        background: #fff;
        max-height: 100px;
        position: sticky;
        /*position: fixed;*/
        bottom: 0;
        /*padding-right: 40px;*/
    }

    .input-field {
        flex-basis: 90%;
        margin-right: 20px;
    }

    .btn {
        display: flex;
        justify-content: center;
        max-width: 150px;
    }

    @media screen and (max-width: 760px) {
        .btn {
            width: 50px;
        }

        i {
            margin-left: 0;
        }
    }
</style>