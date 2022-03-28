import {useField, useForm} from 'vee-validate'
import * as yup from 'yup'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import localizeFilter from '../filters/localize.filter'

export function useRegisterForm() {
    const store = useStore()
    const router = useRouter()

    const {handleSubmit, isSubmitting} = useForm()

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

    const {value: name, errorMessage: nError, handleBlur: nBlur} = useField(
        'name',
        yup
            .string()
            .trim()
            .required(localizeFilter('Message_EnterName'))
    )

    const {value: agree, errorMessage: aError, handleBlur: aBlur} = useField(
        'agree',
        yup
            .boolean()
            .required(localizeFilter('AccepRules'))
    )

    const onSubmit = handleSubmit(async values => {
        try {
            await store.dispatch('auth/register', values)
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
        name,
        nError,
        nBlur,
        agree,
        aBlur,
        aError,
        onSubmit,
        isSubmitting
    }
}