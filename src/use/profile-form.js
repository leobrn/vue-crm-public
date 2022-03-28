import {useField, useForm} from 'vee-validate'
import * as yup from 'yup'
import {useStore} from 'vuex'
import {ref, computed, onMounted, nextTick, inject} from 'vue'
import localizeFilter from '../filters/localize.filter'

export function useProfileForm() {
    const store = useStore()
    const {handleSubmit} = useForm()

    const plMessage = inject('plMessage')

    const info = computed(() => store.getters['info/info'])
    const isRuLocale = ref(true)

    const {value: name, errorMessage: nError, handleBlur: nBlur} = useField(
        'name',
        yup
            .string()
            .trim()
            .required(localizeFilter('Message_EnterName'))
    )

    onMounted(async () => {
        name.value = info.value.name
        isRuLocale.value = info.value.locale === 'ru-RU' || !info.value?.locale
        await nextTick(() => {
            M.updateTextFields()
        })
    })

    const onSubmit = handleSubmit(async values => {
        try {
            await store.dispatch('info/update', {
                name: name.value,
                locale: isRuLocale.value ? 'ru-RU' : 'en-US'
            })
            plMessage('Message_ProfileUpdate')
        } catch (e) {
        }
    })

    return {
        name,
        nError,
        nBlur,
        onSubmit,
        isRuLocale
    }
}