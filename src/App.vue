<template>
    <metainfo :key="locale">
        <template v-slot:title="{ content }">{{ content ? `${content} | CRM` : `CRM` }}</template>
    </metainfo>

    <component :is="layout + '-layout'">
        <router-view/>
    </component>
</template>

<script>
    import {computed, watch} from 'vue'
    import {useStore} from 'vuex'
    import {useRoute} from 'vue-router'
    import {useActiveMeta, useMeta} from 'vue-meta'
    import EmptyLayout from './layout/EmptyLayout'
    import MainLayout from './layout/MainLayout'

    export default {
        setup() {
            useMeta({
                title: '',
                htmlAttrs: {lang: 'ru', amp: true}
            })

            const store = useStore()
            const route = useRoute()
            const layout = computed(() => route.meta.layout || 'empty')

            const locale = computed(() => store.getters['info/info'].locale)

            return {
                layout,
                locale
            }
        },
        components: {
            MainLayout,
            EmptyLayout
        }
    }
</script>

<style scoped>

</style>