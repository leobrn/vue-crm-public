import {useField, useForm} from 'vee-validate'
import * as yup from 'yup'
import {useStore} from 'vuex'
import {ref, computed, inject} from 'vue'
import localizeFilter from '../filters/localize.filter'

export function useRecordForm(idRef = null) {
    const store = useStore()
    const plMessage = inject('plMessage')

    const {handleSubmit} = useForm()

    const {value: desc, errorMessage: dError, handleBlur: dBlur} = useField(
        'desc',
        yup
            .string()
            .trim()
        // .required('Пожалуйста введите описание')
    )

    const MIN_LENGTHE = 1

    const {value: amount, errorMessage: aError, handleBlur: aBlur} = useField(
        'amount',
        yup
            .number()
            .required()
            .min(MIN_LENGTHE, localizeFilter('Message_MinLength') + ` ${MIN_LENGTHE}`)
            .typeError(localizeFilter('Message_EnterFild'))
        // .nullable()
    )

    desc.value = ''
    amount.value = MIN_LENGTHE

    const type = ref('outcome')
    const info = computed(() => store.getters['info/info'])

    const canCreateRecord = computed(() => {
        if (type.value === 'income') {
            return true
        }
        return info.value.bill >= amount.value
    })

    const onSubmit = handleSubmit(async values => {
        try {
            if (canCreateRecord.value) {
                const recordData = {...values, categoryId: idRef.value, type: type.value, date: new Date().toJSON()}
                await store.dispatch('record/create', recordData)
                const bill = type.value === 'income'
                    ? info.value.bill + amount.value
                    : info.value.bill - amount.value
                await store.dispatch('info/update', {bill})
                plMessage('RecordHasBeenCreated')
                amount.value = MIN_LENGTHE
                desc.value = ''
            } else {
                plMessage(`${localizeFilter('NotEnoughMoney')} (${amount.value - info.value.bill})`)
            }
        } catch (e) {
        }
    })

    return {
        type,
        desc,
        dError,
        dBlur,
        amount,
        aError,
        aBlur,
        onSubmit
    }
}