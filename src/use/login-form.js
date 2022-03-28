import {useField, useForm} from 'vee-validate'
import * as yup from 'yup'
import {computed, watch} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import localizeFilter from '../filters/localize.filter'

export function useLoginForm() {
    const store = useStore()
    const router = useRouter()

    const {handleSubmit, isSubmitting, submitCount} = useForm()

    const {value: email, errorMessage: eError, handleBlur: eBlur} = useField(
        'email',
        yup
            .string()
            .trim()
            .required(localizeFilter('Message_EmailRequired'))
            .email(localizeFilter('Message_EmailValid'))
    )

    const MIN_LENGTHE = 6

    const {value: password, errorMessage: pError, handleBlur: pBlur} = useField(
        'password',
        yup
            .string()
            .trim()
            .required(localizeFilter('Message_EnterPassword'))
            .min(MIN_LENGTHE, localizeFilter('Message_MinLength') + ` ${MIN_LENGTHE}`)
    )

    const isTooManyAttemps = computed(() => submitCount.value >= 10)

    watch(isTooManyAttemps, val => {
        if (val) {
            setTimeout(() => submitCount.value = 0, 5000)
        }
    })

    const onSubmit = handleSubmit(async values => {
        try {
            await store.dispatch('auth/login', values)
            router.push('/')
        } catch (e) {
        }
    })

    return {
        email,
        eError,
        eBlur,
        password,
        pError,
        pBlur,
        onSubmit,
        isTooManyAttemps,
        isSubmitting
    }
}