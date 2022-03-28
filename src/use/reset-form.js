import {inject} from 'vue'
import {useField, useForm} from 'vee-validate'
import * as yup from 'yup'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import localizeFilter from '../filters/localize.filter'

export function useResetForm() {
    const store = useStore()
    const router = useRouter()

    const plMessage = inject('plMessage')
    const {handleSubmit, isSubmitting} = useForm()

    const {value: email, errorMessage: eError, handleBlur: eBlur} = useField(
        'email',
        yup
            .string()
            .trim()
            .required(localizeFilter('Message_EmailRequired'))
            .email(localizeFilter('Message_EmailValid'))
    )

    const onSubmit = handleSubmit(async values => {
        try {
            await store.dispatch('auth/reset', values.email)
            plMessage(localizeFilter('EmailSent'))
            router.push('/login')
        } catch (e) {
        }
    })

    return {
        email,
        eError,
        eBlur,
        isSubmitting,
        onSubmit
    }
}