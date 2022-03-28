<template>
    <select ref="select" v-model="currentValue">
        <option disabled selected :value="''" v-if="placeholder">{{placeholder}}</option>
        <option
                v-for="c in options"
                :key="c.id"
                :value="c.id"
        >{{c.name}}
        </option>
    </select>
</template>

<script>
    import {ref, watch, onMounted, onBeforeUnmount, nextTick} from 'vue'

    export default {
        emits: ['update:modelValue'],
        props: {
            modelValue: {},
            options: {
                type: Array,
                required: true
            },
            placeholder: {
                type: String,
                default: ''
            }
        },
        setup(props, {emit}) {
            const select = ref(null)
            const selectEvent = ref(null)
            const currentValue = ref('')

            watch(currentValue, (value) => {
                if (value !== '') {
                    emit('update:modelValue', value)
                }
            })

            watch(props, async (value) => {
                if (value.modelValue === '') {
                    currentValue.value = ''
                    await nextTick(() => {
                        selectEvent.value = M.FormSelect.init(select.value)
                        M.updateTextFields()
                    })
                }
            })

            onMounted(async () => {
                selectEvent.value = M.FormSelect.init(select.value)
                M.updateTextFields()
            })

            onBeforeUnmount(() => {
                if (selectEvent.value && selectEvent.value.destroy) {
                    selectEvent.value.destroy()
                }
            })

            return {
                select,
                currentValue
            }
        }
    }
</script>

<style scoped>

</style>