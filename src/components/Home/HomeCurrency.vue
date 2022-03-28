<template>
    <div class="col s12 m6 l8">
        <div class="card orange darken-3 bill-card">
            <div class="card-content white-text">
                <div class="card-header">
                    <span class="card-title">{{ $filters.localize('CurrencyAmountTitle')}}</span>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>{{ $filters.localize('Currency')}}</th>
                        <th>{{ $filters.localize('CurrencyType')}}</th>
                        <th>{{ $filters.localize('Date')}}</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="item in currencies" :key="item">
                        <td>{{item}}</td>
                        <td>{{rates[item].toFixed(2)}}</td>
                        <td>{{date}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import {ref, computed} from 'vue'
    import dateFilter from '../../filters/date.filters'

    export default {
        props: ['rates', 'date'],
        setup(props) {
            const currencies = ['RUB', 'USD', 'EUR']
            const rates = ref(props.rates)
            const date = ref(props.date)

            return {
                currencies,
                rates,
                date: computed(() => dateFilter(date.value, 'date'))
            }
        }
    }
</script>

<style scoped>

</style>