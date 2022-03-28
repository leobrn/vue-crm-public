<template>
    <form class="card auth-card" @submit.prevent="onSubmit">
        <div class="card-content">
            <span class="card-title">{{ $filters.localize('PasswordRecovery')}}</span>
            <div class="input-field">
                <input
                        id="email"
                        type="text"
                        v-model="email"
                        @blur="eBlur"
                        :class="{invalid: eError}"
                >
                <label for="email">{{ $filters.localize('RegisteredEmail')}}</label>
                <small class="helper-text invalid" v-if="eError">{{eError}}</small>
            </div>
        </div>

        <div class="card-action">
            <button
                    class="btn waves-effect waves-light auth-submit"
                    type="submit"
                    :disabled="isSubmitting"
            >
                {{ $filters.localize('Restore')}}
                <i class="material-icons right">send</i>
            </button>
        </div>

        <p class="center">
            <router-link to="/login">{{ $filters.localize('Login')}}</router-link>
        </p>
    </form>
</template>

<script>
    import {useResetForm} from '../use/reset-form'

    export default {
        setup() {

            return {
                ...useResetForm()
            }
        }
    }
</script>

<style scoped>

</style>