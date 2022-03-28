<template>
    <div class="navbar-fixed">
        <nav class="navbar light-blue ">
            <div class="nav-wrapper">
                <div class="navbar-left">
                    <a href="#"
                       @click.prevent="$emit('click')"
                    >
                        <i class="material-icons white-text">dehaze</i>
                    </a>
                    <span class="white-text hide-on-small-and-down">{{dateFormat}}</span>
                </div>

                <ul class="right">
                    <li>
                        <a
                                class="dropdown-trigger white-text"
                                href="#"
                                data-target="dropdown"
                                ref="dropdown"
                        >
                            {{name}}
                            <i class="material-icons right">arrow_drop_down</i>
                        </a>

                        <ul id='dropdown' class='dropdown-content'>
                            <li>
                                <router-link to="/profile" class="black-text">
                                    <i class="material-icons">account_circle</i>{{ $filters.localize('ProfileTitle')}}
                                </router-link>
                            </li>
                            <li class="divider" tabindex="-1"></li>
                            <li>
                                <a href="#" class="black-text" @click.prevent="logout">
                                    <i class="material-icons">assignment_return</i>{{ $filters.localize('Exit')}}
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
    import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
    import {useRoute, useRouter} from 'vue-router'
    import {useStore} from 'vuex'
    import dateFilter from '../filters/date.filters'

    export default {
        emits: ['click'],
        setup() {
            const store = useStore()
            const route = useRoute()
            const router = useRouter()

            const interval = ref(null)
            const dropdown = ref(null)
            const mDropdown = ref(null)

            const date = ref(new Date())
            const dateFormat = computed(() => dateFilter(date.value, 'datetime'))

            const name = computed(() => store.getters['info/info'].name)

            onMounted(() => {
                interval.value = setInterval(() => {
                    date.value = new Date()
                }, 1000)

                mDropdown.value = M.Dropdown.init(dropdown.value, {
                    constrainWidth: false
                })
            })

            onBeforeUnmount(() => {
                clearInterval(interval.value)
                if (mDropdown.value && mDropdown.value.destroy) {
                    mDropdown.value.destroy()
                }
            })

            const logout = async () => {
                if (route.path.includes('chat')) {
                    await store.dispatch('chat/updateDateReadMessage')
                }
                await store.dispatch('auth/logout')
                router.push('/login?message=logout')
            }

            return {
                dropdown,
                logout,
                dateFormat,
                name
            }
        }
    }
</script>

<style scoped>

</style>