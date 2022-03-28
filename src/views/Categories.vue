<template>
    <div class="page-title">
        <h3>{{ $filters.localize('Categories')}}</h3>
    </div>
    <section>
        <app-loader v-if="loading"/>
        <div class="row" v-else>
            <category-create @created="addNewCategory"/>

            <category-edit
                    v-if="categories.length"
                    :categories="categories"
                    @updated="updateCategories"
                    @deleted="deleteCategory"
                    :key="categories.length + updateCont"
            />
            <p class="center" v-else>{{ $filters.localize('NoCategories')}}</p>
        </div>
    </section>
</template>

<script>
    import {ref, onMounted} from 'vue'
    import {useStore} from 'vuex'
    import {useMeta} from 'vue-meta'
    import CategoryCreate from '../components/Category/CategoryCreate'
    import CategoryEdit from '../components/Category/CategoryEdit'
    import AppLoader from '../components/App/AppLoader'
    import localizeFilter from '../filters/localize.filter'

    export default {
        name: 'categories ',
        setup() {
            useMeta({
                title: localizeFilter('Menu_Categories')
            })

            const store = useStore()

            const categories = ref([])
            const loading = ref(false)
            const updateCont = ref(0)

            onMounted(async () => {
                categories.value = await store.dispatch('category/fetchCategories')
                loading.value = false
            })

            const addNewCategory = category => {
                categories.value.push(category)
            }

            const updateCategories = category => {
                const idx = categories.value.findIndex(c => c.id === category.id)
                categories.value[idx].name = category.name
                categories.value[idx].limit = category.limit
                updateCont.value++
            }

            const deleteCategory = id => {
                categories.value = categories.value.filter(item => id !== item.id)
                updateCont.value--
            }

            return {
                addNewCategory,
                loading,
                categories,
                updateCategories,
                deleteCategory,
                updateCont
            }
        },
        components: {
            CategoryCreate,
            CategoryEdit,
            AppLoader
        }
    }
</script>

<style scoped>

</style>