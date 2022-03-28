import {useField, useForm} from 'vee-validate'
import * as yup from 'yup'
import {useStore} from 'vuex'
import {inject} from 'vue'
import localizeFilter from '../filters/localize.filter'

export function useCategoryCreateForm(emit) {
    const store = useStore()

    const plMessage = inject('plMessage')
    const {handleSubmit, isSubmitting, resetForm} = useForm()

    const {value: name, errorMessage: nError, handleBlur: nBlur} = useField(
        'name',
        yup
            .string()
            .trim()
            .required(localizeFilter('Message_CategoryTitle'))
    )

    const MIN_VALUE = 100

    const {value: limit, errorMessage: lError, handleBlur: lBlur} = useField(
        'limit',
        yup
            .number()
            .required(localizeFilter('Message_EnterLimit'))
            .min(MIN_VALUE, localizeFilter('Message_MinLength') + `: ${MIN_VALUE}`)
            .typeError(localizeFilter('Message_EnterFild'))
    )

    const onSubmit = handleSubmit(async values => {
        try {
            const category = await store.dispatch('category/create', values)
            resetForm({
                limit: MIN_VALUE,
                name: ''
            })
            plMessage(localizeFilter('Category_HasBeenCreated'))
            emit('created', category)
        } catch (e) {
        }
    })

    limit.value = MIN_VALUE

    return {
        isSubmitting,
        onSubmit,
        name,
        nError,
        nBlur,
        limit,
        lError,
        lBlur
    }
}