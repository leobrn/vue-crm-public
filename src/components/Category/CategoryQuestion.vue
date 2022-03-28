<template>
    <a class="waves-effect waves-light btn modal-trigger red" href="#modal">
        {{ $filters.localize('Delete')}}
        <i class="material-icons right">delete</i>
    </a>

    <div id="modal" class="modal" ref="modal">
        <div class="modal-content">
            <h4> {{ $filters.localize('QuestionCategoryRemoved')}} "{{categoryName}}"?</h4>
            <p>{{ $filters.localize('WarningCategoryRemoved')}}</p>
        </div>
        <div class="modal-footer">
            <a href="#" class="modal-close waves-effect waves-green btn-flat" @click="response(true)">{{
                $filters.localize('Agree')}}
            </a>
            <a href="#" class="modal-close waves-effect waves-green btn-flat" @click="response(false)">{{
                $filters.localize('Disagree')}}
            </a>
        </div>
    </div>
</template>

<script>
    import {ref, onMounted, onBeforeUnmount} from 'vue'

    export default {
        emits: ['response'],
        props: {
            categoryName: {
                type: String
            }
        },
        setup(_, {emit}) {
            const modal = ref(null)
            const modalInstances = ref(null)

            onMounted(() => {
                modalInstances.value = M.Modal.init(modal.value)
            })

            onBeforeUnmount(() => {
                if (modalInstances.value && modalInstances.value.destroy) {
                    modalInstances.value.destroy()
                }
            })

            const response = value => {
                emit('response', value)
            }

            return {
                modal,
                response
            }
        }
    }
</script>

<style scoped>
    .modal {
        max-width: 600px;
    }

    p {
        font-size: 18px;
    }

    @media screen and (max-width: 760px) {

        .btn {
            min-width: 142px;
        }
    }
</style>