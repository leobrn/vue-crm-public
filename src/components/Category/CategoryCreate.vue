<template>
    <div class="col s12 m6">
        <div>
            <div class="page-subtitle">
                <h4>{{ $filters.localize('Create')}}</h4>
            </div>

            <form @submit.prevent="onSubmit">
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
                    {{ $filters.localize('Create')}}
                    <i class="material-icons right">send</i>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
    import {onMounted} from 'vue'
    import {useCategoryCreateForm} from '../../use/category-create-form'

    export default {
        setup(_, {emit}) {
            onMounted(() => {
                M.updateTextFields()
            })

            return {
                ...useCategoryCreateForm(emit)
            }
        }
    }
</script>

<style scoped>
    @media screen and (max-width: 760px) {

        .btn {
            margin-bottom: 20px;
        }
    }

</style>