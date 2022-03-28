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
                    ${password?.length || 0}`}}
                </small>
            </div>
            <div class="input-field">
                <input
                        id="name"
                        type="text"
                        v-model="name"
                        @blur="nBlur"
                        :class="{invalid: nError}"
                >
                <label for="name">{{ $filters.localize('Name')}}</label>
                <small class="helper-text invalid" v-if="nError">{{nError}}</small>
            </div>
            <p>
                <label>
                    <input type="checkbox" id="agree"
                           v-model="agree"
                           @blur="aBlur"
                           :class="{invalid: aError}"
                    />
                    <span>{{ $filters.localize('AcceptRules')}}</span>
                </label>
            </p>
            <small class="helper-text invalid" v-if="aError">{{aError}}</small>
        </div>
        <div class="card-action">
            <div>
                <button
                        class="btn waves-effect waves-light auth-submit"
                        type="submit"
                >
                    {{ $filters.localize('Register')}}
                    <i class="material-icons right">send</i>
                </button>
            </div>

            <p class="center">
                {{ $filters.localize('HasAccount')}}
                <router-link to="/login">{{ $filters.localize('Login')}}!</router-link>
            </p>
        </div>
    </form>
</template>

<script>
    import {useRegisterForm} from '../use/register-form'
    import {useMeta} from 'vue-meta'
    import localizeFilter from '../filters/localize.filter'

    export default {
        name: 'registration',
        setup() {
            useMeta({
                title: localizeFilter('Register')
            })

            return {
                ...useRegisterForm()
            }
        }
    }
</script>

<style scoped>
    .auth-card {
        max-width: 500px;
    }

    @media screen and (max-width: 760px) {
        .auth-card {
            width: auto;
        }
    }
</style>