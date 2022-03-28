<template>
    <div class="col s12 m6 l4">
        <div class="card light-blue bill-card">
            <div class="card-content white-text">
                <span class="card-title">{{ $filters.localize('BillInCurrency')}}</span>

                <p class="currency-line"
                   v-for="item in currencies"
                   :key="item"
                >
                    <span>
                        {{getCurrency(item)}}
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import {ref, reactive, computed} from 'vue'
    import {useStore} from 'vuex'
    import currencyFilter from '../../filters/currency.filter'

    export default {
        props: ['rates'],
        setup(props) {
            const store = useStore()
            const currencies = ['RUB', 'USD', 'EUR']

            const rates = ref(props.rates)
            const base = computed(() => store.getters['info/info'].bill / rates.value['RUB'] / rates.value['EUR'])

            const getCurrency = currency => {
                const value = Math.floor(base.value * rates.value[currency])
                return currencyFilter(value, currency)
            }

            return {
                currencies,
                getCurrency
            }
        }
    }
</script>

<style scoped>

</style>