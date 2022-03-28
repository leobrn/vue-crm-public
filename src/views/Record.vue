<template>
    <div class="page-title">
        <h3>{{ $filters.localize('Menu_NewRecord')}}</h3>
    </div>

    <app-loader v-if="loading"/>

    <p class="center" v-else-if="!categories.length">{{ $filters.localize('NoCategories')}}.
        <router-link to="/categories">{{ $filters.localize('AddFirstCategory')}}</router-link>
    </p>

    <form class="form" @submit.prevent="onSubmit" v-else>
        <div class="input-field">
            <select ref="select" v-model="category">
                <option
                        v-for="c in categories"
                        :key="c.id"
                        :value="c.id"
                >{{c.name}}
                </option>
            </select>
            <label>{{ $filters.localize('SelectCategory')}}</label>
        </div>

        <p>
            <label>
                <input
                        class="with-gap"
                        name="type"
                        type="radio"
                        value="income"
                        v-model="type"
                />
                <span>{{ $filters.localize('Income')}}</span>
            </label>
        </p>

        <p>
            <label>
                <input
                        class="with-gap"
                        name="type"
                        type="radio"
                        value="outcome"
                        v-model="type"
                />
                <span>{{ $filters.localize('Outcome')}}</span>
            </label>
        </p>

        <div class="input-field">
            <input
                    id="amount"
                    type="number"
                    v-model.number="amount"
                    @blur="aBlur"
                    :class="{invalid: aError}"
            >
            <label for="amount">{{ $filters.localize('Amount')}}</label>
            <span class="helper-text invalid" v-if="aError">{{aError}}</span>
        </div>

        <div class="input-field">
            <input
                    id="description"
                    type="text"
                    v-model.trim="desc"
                    @blur="dBlur"
                    :class="{invalid: dError}"
            >
            <label for="description">{{ $filters.localize('Description')}}</label>
            <span
                    class="helper-text invalid" v-if="dError">{{ $filters.localize('Message_EnterDescription')}}</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
            {{ $filters.localize('Create')}}
            <i class="material-icons right">send</i>
        </button>
    </form>
</template>

<script>
    import {ref, computed, watch, onMounted, nextTick, onBeforeUnmount} from 'vue'
    import {useStore} from 'vuex'
    import {useMeta} from 'vue-meta'
    import {useRecordForm} from '../use/record-form'
    import localizeFilter from '../filters/localize.filter'
    import AppLoader from '../components/App/AppLoader'

    export default {
        name: 'record',
        setup() {
            useMeta({
                title: localizeFilter('Menu_NewRecord')
            })

            const store = useStore()

            const loading = ref(true)
            const categories = ref([])
            const category = ref(null)

            const select = ref(null)
            const selectEvent = ref(null)

            onMounted(async () => {
                categories.value = await store.dispatch('category/fetchCategories')
                loading.value = false

                if (categories.value.length) {
                    category.value = categories.value[0].id
                }

                await nextTick(() => {
                    selectEvent.value = M.FormSelect.init(select.value)
                    M.updateTextFields()
                })
            })

            onBeforeUnmount(() => {
                if (selectEvent.value && selectEvent.value.destroy) {
                    selectEvent.value.destroy()
                }
            })

            return {
                ...useRecordForm(computed(() => category.value)),
                select,
                loading,
                categories,
                category
            }
        },
        components: {
            AppLoader
        }
    }
</script>

<style scoped>

</style>