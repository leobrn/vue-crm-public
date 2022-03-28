<template>
    <div class="col s12 m6">
        <div>
            <div class="page-subtitle">
                <h4>{{ $filters.localize('Edit')}}</h4>
            </div>

            <form @submit.prevent="update">
                <div class="input-field">
                    <select ref="select" v-model="current">
                        <option
                                v-for="c in categories"
                                :key="c.id"
                                :value="c.id"
                        >{{c.name}}
                        </option>
                    </select>
                    <label>{{ $filters.localize('SelectCategory')}}</label>
                </div>

                <div class="input-field">
                    <input
                            id="name"
                            type="text"
                            v-model="name"
                            @blur="nBlur"
                            :class="{invalid: nError}"
                    >
                    <label for="name">{{ $filters.localize('Title')}}</label>
                    <span class="helper-text invalid" v-if="nError">{{nError}}</span>
                </div>

                <div class="input-field">
                    <input
                            id="limit"
                            type="number"
                            v-model.number="limit"
                            @blur="lBlur"
                            :class="{invalid: lError}"
                    >
                    <label for="limit">{{ $filters.localize('Limit')}}</label>
                    <span class="helper-text invalid" v-if="lError">{{lError}}</span>
                </div>

                <button class="btn waves-effect waves-light" type="submit">
                    {{ $filters.localize('Update')}}
                    <i class="material-icons right">send</i>
                </button>
                <!--                <button class="btn waves-effect waves-light red" @click.prevent="deleteCategory" v-if="current">-->
                <!--                    {{ $filters.localize('Delete')}}-->
                <!--                    <i class="material-icons right">delete</i>-->
                <!--                </button>-->
                <category-question @response="deleteCategory" :categoryName="name"/>
            </form>
        </div>
    </div>
</template>

<script>
    import {ref, watch, onMounted, onBeforeUnmount, inject} from 'vue'
    import {useStore} from 'vuex'
    import {useCategoryCreateForm} from '../../use/category-create-form'
    import localizeFilter from '../../filters/localize.filter'
    import CategoryQuestion from './CategoryQuestion'

    export default {
        props: {
            categories: {
                type: Array,
                required: true,
                default: []
            }
        },
        setup(props, {emit}) {
            const store = useStore()
            const plMessage = inject('plMessage')

            const select = ref(null)
            const selectEvent = ref(null)

            const {name, nError, nBlur, limit, lError, lBlur} = useCategoryCreateForm(emit)

            const current = ref(null)
            const categories = ref(props.categories)

            const {id: idCurrent, name: nameCurrent, limit: limitCurrent} = categories.value[0]
            current.value = idCurrent
            name.value = nameCurrent
            limit.value = limitCurrent

            const update = async () => {
                const categoryData = {
                    name: name.value,
                    limit: limit.value,
                    id: current.value
                }
                await store.dispatch('category/update', categoryData)
                plMessage('Category_HasBeenUpdated')
                emit('updated', categoryData)
            }
            const deleteCategory = async response => {
                try {
                    if (response) {
                        await store.dispatch('category/remove', current.value)
                        plMessage(localizeFilter('CategoryRemoved'))
                        emit('deleted', current.value)
                    }
                } catch (e) {
                }
            }

            onMounted(() => {
                selectEvent.value = M.FormSelect.init(select.value)
                M.updateTextFields()
            })

            watch(current, value => {
                const {name: nameCurrent, limit: limitCurrent} = categories.value.find(c => c.id === value)
                name.value = nameCurrent
                limit.value = limitCurrent
            })

            onBeforeUnmount(() => {
                if (selectEvent.value && selectEvent.value.destroy) {
                    selectEvent.value.destroy()
                }
            })

            return {
                select,
                current,
                name,
                nError,
                nBlur,
                limit,
                lError,
                lBlur,
                update,
                deleteCategory
            }
        },
        components: {
            CategoryQuestion
        }
    }
</script>

<style scoped>
    .btn {
        margin-right: 20px;
    }

    @media screen and (max-width: 760px) {

        .btn {
            margin-bottom: 20px;
            min-width: 142px;
        }
    }
</style>