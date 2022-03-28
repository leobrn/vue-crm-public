<template>
    <form class="card auth-card" @submit.prevent="onSubmit">
        <div class="card-content">
            <span class="card-title">{{ $filters.localize('CRM_Title')}}</span>
            <div class="input-field">
                <input
                        id="email"
                        type="text"
                        v-model="email"
                        @blur="eBlur"
                        :class="{invalid: eError}"
                        autocomplete="off"
                >
                <label for="email">Email</label>
                <small class="helper-text invalid" v-if="eError">{{eError}}</small>
            </div>
            <div class="input-field">
                <input
                        id="password"
                        type="password"
                        autocomplete="off"
                        v-model="password"
                        @blur="pBlur"
                        :class="{invalid: pError}"
                >
                <label for="password">{{ $filters.localize('Password')}}</label>
                <small class="helper-text invalid" v-if="pError">{{pError + `. ${ $filters.localize('PresentValue')}
                    ${password?.length || 0}`}}</small>
            </div>
        </div>
        <div class="card-action">
            <button
                    class="btn waves-effect waves-light auth-submit"
                    type="submit"
                    :disabled="isSubmitting || isTooManyAttemps"
            >
                {{ $filters.localize('Login')}}
                <i class="material-icons right">send</i>
            </button>
            <small class="helper-text invalid" v-if="isTooManyAttemps">
                Вы слишком часто пытаетесь войти в систему. Попробуйте позже
            </small>
        </div>

        <p class="center">
            {{ $filters.localize('NoAccount')}}
            <router-link to="/register">{{ $filters.localize('Register')}}</router-link>
        </p>
        <p class="center">
            <router-link to="/reset">{{ $filters.localize('FogotPassword')}}?</router-link>
        </p>
    </form>
</template>

<script>
    import {inject, onMounted} from 'vue'
    import {useRoute} from 'vue-router'
    import {useLoginForm} from '../use/login-form'
    import {useMeta} from 'vue-meta'
    import localizeFilter from '../filters/localize.filter'
    import messages from '../utils/messages'

    export default {
        name: 'login',
        setup() {
            useMeta({
                title: localizeFilter('Login')
            })

            const route = useRoute()
            const plMessage = inject('plMessage')

            onMounted(() => {
                const text = messages[route.query.message]
                if (text) {
                    plMessage(text)
                }
            })

            return {
                ...useLoginForm()
            }
        }
    }
</script>

<style scoped>
    .auth-card {
        /*width: auto;*/
        max-width: 500px;
    }

    @media screen and (max-width: 760px) {
        .auth-card {
            width: auto;
        }
    }
</style>