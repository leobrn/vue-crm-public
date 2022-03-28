<template>
    <ul class="sidenav app-sidenav collapsible" :class="{open: isOpen}">
        <router-link v-for="link in links"
                     :key="link.url"
                     :to="link.url"
                     @click="$emit('changeOpen', isOpen)"
                     v-slot="{ href, navigate, isActive }"
        >
            <li :class="{ 'active': isActive }">
                <div class="collapsible-header">
                    <a :href="href"
                       @click="navigate"
                       class="waves-effect waves-teal pointer"> {{ $filters.localize(link.title)}}</a>
                    <span class="new badge" v-if="link.badge && newMessages > 0">{{newMessages}}</span>
                </div>
            </li>
        </router-link>
    </ul>
</template>

<script>
    import {ref, watch, computed} from 'vue'
    import {useStore} from 'vuex'

    export default {
        emits: ['changeOpen'],
        props: {
            isOpen: {
                type: Boolean,
                default: true
            },
            mobile: {
                type: Boolean,
                default: false
            }
        },
        setup(props) {
            const links = [
                {title: 'Menu_Bill', url: '/'},
                {title: 'Menu_History', url: '/history'},
                {title: 'Menu_Planning', url: '/planning'},
                {title: 'Menu_NewRecord', url: '/record'},
                {title: 'Menu_Categories', url: '/categories'},
                {title: 'Menu_Chat', url: '/chat', badge: true}
            ]
            const store = useStore()
            const newMessages = computed(() => store.getters['chat/newMessages'])

            const isOpen = ref(props.isOpen)
            watch(props, newValue => {
                isOpen.value = newValue.isOpen
            })

            return {
                links,
                isOpen,
                newMessages
            }
        }
    }
</script>

<style scoped>
    .sidenav {
        z-index: 996;
        overflow: hidden;
        position: fixed;
    }
</style>