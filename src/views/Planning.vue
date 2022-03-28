<template>
    <div class="page-title">
        <h3>{{ $filters.localize('Menu_Planning')}}</h3>
        <h4>{{bill}}</h4>
    </div>

    <app-loader v-if="loading"/>

    <p class="center" v-else-if="!categories.length">{{ $filters.localize('NoCategories')}}.
        <router-link to="/categories">{{ $filters.localize('AddFirstCategory')}}</router-link>
    </p>

    <section v-else>
        <div v-for="cat in categories"
             :key="cat.id"
        >
            <p>
                <strong>{{cat.name}}</strong>
                {{currencyFilter(cat.spend)}} из {{currencyFilter(cat.limit)}}
            </p>
            <div class="progress" v-tooltip="cat.tooltip">
                <div
                        class="determinate"
                        :class=[cat.progressColor]
                        :style="{width: cat.progressPercent + '%'}"
                ></div>
            </div>
        </div>
    </section>
</template>

<script>
    import {ref, computed, onMounted} from 'vue'
    import {useStore} from 'vuex'
    import {useMeta} from 'vue-meta'
    import currencyFilter from '../filters/currency.filter'
    import localizeFilter from '../filters/localize.filter'
    import AppLoader from '../components/App/AppLoader'

    export default {
        name: 'planning',
        setup() {
            useMeta({
                title: localizeFilter('Menu_Planning')
            })

            const store = useStore()
            const loading = ref(true)
            const categories = ref([])

            onMounted(async () => {
                const records = await store.dispatch('record/fetchRecords')
                categories.value = await store.dispatch('category/fetchCategories')

                categories.value = categories.value.map(cat => {
                    const spend = records
                        .filter(r => r.categoryId === cat.id)
                        .filter(r => r.type === 'outcome')
                        .reduce((total, record) => {
                            return total += +record.amount
                        }, 0)

                    const percent = 100 * spend / cat.limit
                    const progressPercent = percent > 100 ? 100 : percent
                    const progressColor = percent < 60
                        ? 'grenn'
                        : percent < 100
                            ? 'yellow'
                            : 'red'

                    const tooltipValue = cat.limit - spend
                    const tooltip = `${tooltipValue < 0 ? localizeFilter('MoreThan') : localizeFilter('Stayed')} ${currencyFilter(Math.abs(tooltipValue))}`

                    return {
                        ...cat,
                        progressPercent,
                        progressColor,
                        spend,
                        tooltip
                    }
                })
                loading.value = false
            })

            const info = computed(() => store.getters['info/info'])
            const bill = computed(() => currencyFilter(info.value.bill))

            return {
                loading,
                categories,
                bill,
                currencyFilter
            }
        },
        components: {
            AppLoader
        }
    }
</script>

<style scoped>
    @media screen and (max-width: 760px) {

        .page-title {
            flex-wrap: wrap;
        }
    }
</style>