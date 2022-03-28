import {reactive, watch, onBeforeUnmount} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import _ from 'lodash'

export function usePagination() {
    const route = useRoute()
    const router = useRouter()

    const pagination = reactive({
        page: +route.query.page || 1,
        pageSize: 5,
        pageCount: 0,
        allItems: [],
        items: []
    })

    pagination.setupPagination = (itemsData) => {
        pagination.allItems = _.chunk(itemsData, pagination.pageSize)
        pagination.pageCount = _.size(pagination.allItems)
        pagination.items = pagination.allItems[pagination.page - 1] || pagination.allItems[0]
        pagination.page = pagination.page > pagination.pageCount ? 1 : pagination.page
    }

    pagination.pageChangeHandler = newPage => {
        router.push({
            query: {page: newPage}
        })
        pagination.page = newPage
        pagination.items = pagination.allItems[newPage - 1] || pagination.allItems[0]
    }

    watch(() => route.query, () => {
        if (!route.query.page) {
            pagination.pageChangeHandler(1)
        }
    })

    onBeforeUnmount(() => {
        router.replace({
            ...router.currentRoute,
            query: {
                page: undefined
            }
        })
    })

    return pagination
}