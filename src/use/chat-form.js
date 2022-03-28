import {useField, useForm} from 'vee-validate'
import * as yup from 'yup'
import {useStore} from 'vuex'
import {nextTick, onMounted, ref, watch} from 'vue'


export function useChatForm(props) {
    const store = useStore()
    const {handleSubmit, isSubmitting, resetForm} = useForm()
    const chatForm = ref(null)

    const {value: text, handleBlur: mBlur} = useField(
        'message',
        yup
            .string()
            .trim()
            .required()
    )

    const scrollIntoView = () => {
        nextTick(() => {
            chatForm.value.scrollIntoView({behavior: 'smooth'})
        })
    }

    const onSubmit = handleSubmit(async values => {
        try {
            await store.dispatch('chat/sendMessage', values.message)
            resetForm({
                text: ''
            })
            scrollIntoView()
        } catch (e) {
        }
    })

    onMounted(() => {
        scrollIntoView()
    })

    watch(props, () => {
        scrollIntoView()
    }, {
        deep: true
    })

    return {
        text,
        mBlur,
        isSubmitting,
        onSubmit,
        chatForm
    }
}