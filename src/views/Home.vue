<template>
    <div class="page-title">
        <h3>{{ $filters.localize('Bill')}}</h3>

        <button class="btn waves-effect waves-light btn-small" @click="refresh">
            <i class="material-icons">refresh</i>
        </button>
    </div>

    <app-loader v-if="loading"/>

    <div class="row" v-else>
        <home-bill
                :rates="currency.rates"
        />

        <home-currency
                :rates="currency.rates"
                :date="currency.date"
        />
    </div>
</template>

<script>
    import {ref, onMounted} from 'vue'
    import {useStore} from 'vuex'
    import {useMeta} from 'vue-meta'
    import localizeFilter from '../filters/localize.filter'
    import HomeBill from '../components/Home/HomeBill'
    import HomeCurrency from '../components/Home/HomeCurrency'

    export default {
        name: 'Home',
        setup() {
            useMeta({
                title: localizeFilter('Bill')
            })

            const store = useStore()

            const loading = ref(true)
            const currency = ref(null)

            onMounted(async () => {
                currency.value = await store.dispatch('fetchCurrency')
                currency.value.rates['EUR'] = 1
                loading.value = false
            })

            const refresh = async () => {
                loading.value = true
                currency.value = await store.dispatch('fetchCurrency')
                loading.value = false
            }

            return {
                loading,
                currency,
                refresh
            }
        },
        components: {
            HomeBill,
            HomeCurrency
        }
    }
</script>
