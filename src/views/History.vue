<template>
    <div class="page-title">
        <h3>{{ $filters.localize('History_Title')}}</h3>
    </div>

    <div class="history-chart">
        <vue3-chart-js
                ref="chartRef"
                :id="pieChart.id"
                :type="pieChart.type"
                :data="pieChart.data"
                :options="pieChart.options"
        ></vue3-chart-js>
    </div>

    <app-loader v-if="loading"/>

    <p v-else-if="!records.length" class="center">
        {{ $filters.localize('NoRecords')}}
        <router-link to="/record">{{ $filters.localize('AddFirst')}}</router-link>
    </p>

    <section v-else>
        <div class="filters">
            <app-select :options="categories" :placeholder="localizeFilter('SelectCategory')" v-model="filterCategory"/>
            <app-select :options="types" :placeholder="localizeFilter('SelectType')" v-model="filterType"/>
            <button class="btn btn-flex waves-effect waves-light"
                    @click="resetFilter"
                    :disabled="filterCategory === '' && filterType === ''"
            >
                {{ $filters.localize('Reset')}}<i class="material-icons right">delete</i>
            </button>
        </div>

        <history-table :records="pagination.items" @sortTable="sortHandler"/>

        <app-pagination
                :page="pagination.page"
                :page-count="pagination.pageCount"
                @click-handler="pagination.pageChangeHandler"
        />
    </section>
</template>

<script>
    import {ref, reactive, watch, onMounted} from 'vue'
    import {useStore} from 'vuex'
    import {useMeta} from 'vue-meta'
    import {usePagination} from '../use/pagination'
    import localizeFilter from '../filters/localize.filter'
    import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
    import AppLoader from '../components/App/AppLoader'
    import AppPagination from '../components/App/AppPagination'
    import AppSelect from '../components/App/AppSelect'
    import HistoryTable from '../components/History/HistoryTable'

    export default {
        name: 'history',
        setup() {
            useMeta({
                title: localizeFilter('Menu_History')
            })

            const store = useStore()

            const loading = ref(true)
            const records = ref([])

            const pagination = usePagination()

            const chartRef = ref(null)
            const pieChart = reactive({
                id: 'pie',
                type: 'pie',
                data: {
                    labels: [],
                    datasets: []
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: localizeFilter('CostsForCategories')
                        }
                    }
                }
            })

            const categories = ref([])
            const types = ref([
                {
                    id: 'income',
                    name: localizeFilter('Income')
                },
                {
                    id: 'outcome',
                    name: localizeFilter('Outcome')
                }
            ])
            const sortOptions = reactive({})
            const filterCategory = ref('')
            const filterType = ref('')

            const init = categories => {
                records.value = records.value.map(record => {
                    return {
                        ...record,
                        categoryName: categories.find(c => c.id === record.categoryId).name,
                        typeClass: record.type === 'income' ? 'green' : 'red',
                        typeText: record.type === 'income' ? localizeFilter('Income') : localizeFilter('Outcome')
                    }
                })

                pieChart.data.labels = categories.map(c => c.name)
                pieChart.data.datasets = [
                    {
                        backgroundColor: ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'],
                        data: categories.map(c => {
                            return records.value.reduce((total, r) => {
                                if (r.categoryId === c.id && r.type === 'outcome') {
                                    total += +r.amount
                                }
                                return total
                            }, 0)
                        })
                    }
                ]

                chartRef.value.update()
            }
            onMounted(async () => {
                records.value = await store.dispatch('record/fetchRecords')
                categories.value = await store.dispatch('category/fetchCategories')

                init(categories.value)
                pagination.setupPagination(records.value)

                loading.value = false
            })

            const sortRecords = (sortOptions, arrRecords) => {
                return arrRecords.sort(
                    (a, b) => {
                        if (sortOptions.current === 'amount') {
                            return sortOptions.amount === 'down'
                                ? b.amount - a.amount
                                : a.amount - b.amount
                        } else if (sortOptions.current === 'date') {
                            return sortOptions.date === 'down'
                                ? new Date(b.date) - new Date(a.date)
                                : new Date(a.date) - new Date(b.date)
                        }
                    }
                )
            }
            const filterRecords = arrRecords => {
                return arrRecords
                    .filter(record => {
                        const value = filterCategory.value
                        if (value && value !== '') {
                            return record.categoryId === value
                        }
                        return record
                    })
                    .filter(record => {
                        const value = filterType.value
                        if (value && value !== '') {
                            return record.type === value
                        }
                        return record
                    })
            }

            const sortHandler = options => {
                const filterItems = filterRecords(records.value)
                const sortItems = sortRecords(options, filterItems)
                pagination.setupPagination(sortItems)
                sortOptions.value = options
            }
            watch(filterCategory, value => {
                const newItems = filterRecords(records.value)
                pagination.setupPagination(newItems)
            })
            watch(filterType, value => {
                const newItems = filterRecords(records.value)
                pagination.setupPagination(newItems)
            })

            const resetFilter = () => {
                filterCategory.value = ''
                filterType.value = ''
                const newItems = sortRecords(sortOptions.value, records.value)
                pagination.setupPagination(newItems)
            }

            return {
                loading,
                records,
                pagination,
                pieChart,
                chartRef,
                sortHandler,
                categories,
                types,
                filterCategory,
                filterType,
                localizeFilter,
                resetFilter
            }
        },
        components: {
            AppLoader,
            AppSelect,
            AppPagination,
            HistoryTable,
            Vue3ChartJs
        }
    }
</script>

<style>
    .history-chart {
        max-width: 400px;
        margin-bottom: 20px;
    }

    .filters {
        display: flex;
        flex-wrap: nowrap;
        max-width: 600px;
        align-items: center;
    }

    .btn-flex {
        display: flex;
        flex-wrap: nowrap;
        flex-basis: 37%;
        max-width: 110px;
    }

    .select-wrapper {
        width: 100%;
        margin-right: 20px;
        margin-bottom: 10px;
    }

    @media screen and (max-width: 760px) {
        .filters {
            display: block;
        }

        .btn-flex {
            display: block;
            float: right;
        }

    }
</style>