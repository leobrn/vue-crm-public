<template>
    <table>
        <thead>
        <tr>
            <th class="hide-on-small-only">#</th>
            <th>{{ $filters.localize('Amount')}}
                <i class="material-icons custom-i"
                   :class="{'green-text': sortOptions.current === 'amount'}"
                   @click="changeSort('amount')"
                >
                    {{sortOptions.amount === 'down' ? 'arrow_drop_down' : 'arrow_drop_up'}}
                </i>
            </th>
            <th>{{ $filters.localize('Date')}}
                <i class="material-icons custom-i"
                   :class="{'green-text': sortOptions.current === 'date'}"
                   @click="changeSort('date')"
                >
                    {{sortOptions.date === 'down' ? 'arrow_drop_down' : 'arrow_drop_up'}}
                </i>
            </th>
            <th class="hide-on-small-only">{{ $filters.localize('Category')}}</th>
            <th>{{ $filters.localize('Type')}}</th>
            <th>{{ $filters.localize('Open')}}</th>
            <th class="hide-on-small-only hide">{{ $filters.localize('Delete')}}</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(record, idx) in recordsSort" :key="record.id">
            <td class="hide-on-small-only">{{idx + 1}}</td>
            <td>{{currencyFilter(record.amount)}}</td>
            <td class="datetime">{{dateFilter(record.date, filterDate)}}</td>
            <td class="hide-on-small-only"> {{record.categoryName}}</td>
            <td>
                <span class="white-text badge" :class="[record.typeClass]">
                    {{record.typeText}}
                </span>
            </td>
            <td>
                <button
                        class="btn-small btn"
                        @click="router.push(`/details/${record.id}`)"
                        v-tooltip="localizeFilter('OpenRecord')"
                >
                    <i class="material-icons">open_in_new</i>
                </button>
            </td>
            <td>
                <button
                        class="btn-small btn red hide-on-small-only hide"
                        @click="deleteRecord(record.id)"
                >
                    <i class="material-icons">delete</i>
                </button>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    import {reactive, computed} from 'vue'
    import {useRouter} from 'vue-router'
    import currencyFilter from '../../filters/currency.filter'
    import dateFilter from '../../filters/date.filters'
    import localizeFilter from '../../filters/localize.filter'

    export default {
        emits: ['sortTable'],
        props: {
            records: {
                type: Array,
                required: true,
                default: []
            }
        },
        setup(props, {emit}) {
            const router = useRouter()

            const filterDate = computed(() => window.innerWidth < 770 ? 'date' : 'datetime')

            const sortOptions = reactive({
                current: 'date',
                date: 'up',
                amount: 'down'
            })

            const changeSort = (key) => {
                sortOptions.current = key
                sortOptions[key] = sortOptions[key] === 'down' ? 'up' : 'down'
                emit('sortTable', sortOptions)
            }

            const recordsSort = computed(() => props.records)
            const deleteRecord = id => {
                console.log(id)
            }
            return {
                router,
                sortOptions,
                changeSort,
                recordsSort,
                dateFilter,
                currencyFilter,
                localizeFilter,
                filterDate,
                deleteRecord
            }
        }

    }
</script>

<style scoped>
    .custom-i {
        vertical-align: middle;
        cursor: pointer;
        font-size: 30px;
        margin-left: 5px;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    @media screen and (max-width: 760px) {
        tbody {
            font-size: 12px;
        }

        .datetime {
            width: 80%;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        th {
            white-space: nowrap;
        }

        .custom-i {
            margin-left: 0;
        }

        span.badge {
            font-size: 12px;
        }
    }
</style>