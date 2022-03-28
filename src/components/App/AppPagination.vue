<template>
    <ul class="pagination">
        <li class="waves-effect" :class="{'disabled': disabledPrev}">
            <a href="#" @click.prevent="clickHandler(page, false)"><i class="material-icons">chevron_left</i></a>
        </li>
        <template v-for="item in pageCount">
            <li class="waves-effect" :class="{'active': item === page}">
                <a href="#" @click.prevent="$emit('clickHandler', item)">{{item}}</a>
            </li>
        </template>
        <li class="waves-effect" :class="{'disabled': disabledNext}">
            <a href="#" @click.prevent="clickHandler(page)">
                <i class="material-icons">chevron_right</i>
            </a>
        </li>
    </ul>
</template>

<script>
    import {ref, watch} from 'vue'

    export default {
        emits: ['clickHandler'],
        props: {
            page: {
                type: Number,
                default: 1,
                required: true
            },
            pageCount: {
                type: Number,
                default: 1,
                required: true
            }
        },
        setup(props, {emit}) {
            const disabledPrev = ref(true)
            const disabledNext = ref(false)

            watch(props, () => {
                disabledPrev.value = props.page <= 1
                disabledNext.value = props.page >= props.pageCount
            }, {
                immediate: true
            })

            const clickHandler = (page, next = true) => {
                if (next && !disabledNext.value) {
                    emit('clickHandler', page + 1)
                } else if (!next && !disabledPrev.value) {
                    emit('clickHandler', page - 1)
                }
            }

            return {
                disabledPrev,
                disabledNext,
                clickHandler
            }
        }
    }
</script>

<style scoped>
    .pagination {
        margin-bottom: 2rem;
    }
</style>