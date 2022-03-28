<template>
    <div class="grey darken-1 empty-layout">
        <router-view/>
    </div>
</template>

<script>
    import {computed, watch, inject} from 'vue'
    import {useStore} from 'vuex'
    import localizeFilter from '../filters/localize.filter'
    import messages from '../utils/messages'

    export default {
        setup() {
            const store = useStore()
            const plError = inject('plError')

            const error = computed(() => store.getters.error)
            watch(error, fbError => {
                plError(messages[fbError.code] ||  localizeFilter('SomethingWrong'))
            })
        }
    }
</script>

<style scoped>

</style>