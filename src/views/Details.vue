<template>
    <app-loader v-if="loading"/>
    <template v-else-if="record">
        <div class="breadcrumb-wrap">
            <router-link to="/history" class="breadcrumb">{{ $filters.localize('Menu_History')}}</router-link>
            <a class="breadcrumb" @click.prevent>
                {{record.type === 'income' ? localizeFilter('Income') : localizeFilter('Outcome') }}
            </a>
        </div>
        <div class="row">
            <div class="col s12 m6">
                <div class="card"
                     :class="{
                      'red': record.type === 'outcome',
                      'green': record.type === 'income'
                     }"
                >
                    <div class="card-content white-text">
                        <p>{{ $filters.localize('Description')}}: {{record.desc}}</p>
                        <p>{{ $filters.localize('Amount')}}: {{currencyFilter(record.amount)}}</p>
                        <p>{{ $filters.localize('Category')}}: {{record.categoryName}}</p>

                        <small>{{dateFilter(record.date, 'datetime')}}</small>
                    </div>
                </div>
                <button class="btn" @click="deleteRecord">{{ $filters.localize('Delete')}}
                    <i class="material-icons right">delete</i>
                </button>
            </div>
        </div>
    </template>
    <p class="center" v-else>{{ $filters.localize('RecordNotFound') + id}}</p>
</template>

<script>
    import {ref, onMounted, inject} from 'vue'
    import {useStore} from 'vuex'
    import {useRoute, useRouter} from 'vue-router'
    import {useMeta} from 'vue-meta'
    import currencyFilter from '../filters/currency.filter'
    import dateFilter from '../filters/date.filters'
    import localizeFilter from '../filters/localize.filter'

    export default {
        name: 'Detail',
        setup() {
            useMeta({
                title: localizeFilter('Detail_Title')
            })

            const store = useStore()
            const route = useRoute()
            const router = useRouter()

            const plMessage = inject('plMessage')

            const record = ref(null)
            const loading = ref(true)
            const id = ref(null)

            onMounted(async () => {
                try {
                    id.value = route.params.id
                    const recordData = await store.dispatch('record/fetchRecordById', id.value)
                    const category = await store.dispatch('category/fetchCategoryById', recordData.categoryId)

                    record.value = {
                        ...recordData,
                        categoryName: category.name
                    }
                } catch (e) {
                }
                loading.value = false
            })

            const deleteRecord = async () => {
                try {
                    await store.dispatch('record/remove', id.value)
                    plMessage(localizeFilter('DeleteRecord'))
                    router.push('/history')
                } catch (e) {
                }
            }

            return {
                loading,
                record,
                id,
                deleteRecord,
                currencyFilter,
                dateFilter,
                localizeFilter
            }
        }
    }
</script>

<style scoped>
    .btn {
        float: right;
    }
</style>