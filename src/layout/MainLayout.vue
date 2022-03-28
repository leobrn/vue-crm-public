<template>
    <app-loader v-if="loading"/>

    <div class="app-main-layout" v-else>
        <the-navbar @click="isOpen = !isOpen"/>
        <the-slidebar :isOpen="isOpen" :mobile="mobileSideBar" @changeOpen="changeOpen"/>

        <main class="app-content" :class="{'full': !isOpen}">
            <div class="modal-backdrop" @click="isOpen = !isOpen" v-if="isOpen && mobileSideBar"></div>
            <div class="app-page">
                <router-view/>
            </div>
        </main>

        <div class="fixed-action-btn" v-if="!isChat">
            <router-link class="btn-floating btn-large blue"
                         to="/record"
                         v-tooltip="localizeFilter('CreateNewRecord')"
                         :key="locale"
            >
                <i class="large material-icons">add</i>
            </router-link>
        </div>
    </div>
</template>

<script>
    import {ref, onMounted, inject, computed, watch} from 'vue'
    import {useStore} from 'vuex'
    import {useRoute} from 'vue-router'
    import localizeFilter from '../filters/localize.filter'
    import TheNavbar from '../components/TheNavbar'
    import TheSlidebar from '../components/TheSlidebar'
    import messages from '../utils/messages'

    export default {
        name: 'main-layout',
        setup() {
            const store = useStore()
            const route = useRoute()
            const isOpen = ref(true)
            const loading = ref(true)

            const mobileSideBar = ref(false)
            if (window.innerWidth < 770) {
                isOpen.value = false
                mobileSideBar.value = true
            }

            const isChat = computed(() => route.path.includes('chat'))
            const locale = computed(() => store.getters['info/info'].locale)

            onMounted(async () => {
                if (!store.getters['info/info'].bill || !!store.getters['info/info'].name) {
                    await store.dispatch('info/fetchInfo')
                }
                await store.dispatch('chat/fetchMessage')
                loading.value = false
            })

            const plError = inject('plError')

            const error = computed(() => store.getters.error)
            watch(error, fbError => {
                plError(messages[fbError.code] || localizeFilter('SomethingWrong'))
            })

            const changeOpen = () => {
                if (mobileSideBar.value) {
                    isOpen.value = !isOpen.value
                }
            }

            return {
                isOpen,
                loading,
                localizeFilter,
                locale,
                mobileSideBar,
                changeOpen,
                isChat
            }
        },
        components: {
            TheNavbar,
            TheSlidebar

        }
    }
</script>

<style scoped>
    .app-content {
        padding-top: 0;
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .35);
        z-index: 100;
    }

</style>