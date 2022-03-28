<template>
    <div class="page-title">
        <h3>{{ $filters.localize('ProfileTitle')}}</h3>
    </div>

    <div class="row">
        <div class="col s12 m6">
            <form class="form" @submit.prevent="onSubmit">
                <div class="input-field">
                    <input
                            id="description"
                            type="text"
                            v-model="name"
                            @blur="nBlur"
                    >
                    <label for="description">{{ $filters.localize('Name')}}</label>
                    <span class="helper-text invalid"
                          v-if="nError">{{ $filters.localize('Message_EnterName')}}</span>
                </div>

                <div class="switch">
                    <label>
                        English
                        <input type="checkbox" v-model="isRuLocale">
                        <span class="lever"></span>
                        Русский
                    </label>
                </div>

                <button class="btn waves-effect waves-light" type="submit">
                    {{ $filters.localize('Update')}}
                    <i class="material-icons right">send</i>
                </button>
            </form>
        </div>
        <div class="col s12 m6 center">
            <app-loader v-if="loading"/>
            <template v-else>
                <div class="form">
                    <div class="avatar-container">
                        <input type="file" accept="image/*" class="hide" ref="avatarFile" @change="changeAvatar">
                        <div class="avatar">
                            <!--                            <img :src="avatarSrc" class="circle responsive-img avatar-img" v-if="avatarSrc">-->
                            <app-avatar :size="200" :name="nameAvatar" :src="avatarSrc"/>
                            <div class="avatar-button circle black">
                                <button class="button-camera white-text" @click="browse">
                                    <i class="material-icons medium">camera_alt</i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button class="btn waves-effect waves-light" v-if="avatarSrc" @click="deleteAvatar">
                        {{ $filters.localize('Delete')}}
                        <i class="material-icons right">delete</i>
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import {ref, computed, onMounted} from 'vue'
    import {useStore} from 'vuex'
    import {useMeta} from 'vue-meta'
    import {useProfileForm} from '../use/profile-form'
    import localizeFilter from '../filters/localize.filter'
    import AppAvatar from '../components/App/AppAvatar'
    import AppLoader from '../components/App/AppLoader'

    export default {
        setup() {
            const computedMeta = computed(() => ({
                title: localizeFilter('ProfileTitle')
            }))
            useMeta(computedMeta)

            const store = useStore()
            const info = computed(() => store.getters['info/info'])
            const nameAvatar = computed(() => info.value.name)
            const avatarSrc = ref(info.value.photo)
            const avatarFile = ref(null)
            const loading = ref(true)

            onMounted(async () => {
                const url = await store.dispatch('info/getFile')
                avatarSrc.value = url
                loading.value = false
            })

            const browse = () => {
                avatarFile.value.click()
            }

            const changeAvatar = async e => {
                loading.value = true
                const file = e.target.files[0]
                try {
                    await store.dispatch('info/deleteFile')
                    avatarSrc.value = await store.dispatch('info/uploadFile', file)
                    loading.value = false
                    // const reader = new FileReader()
                    // reader.readAsDataURL(file)
                    // reader.onload = async e => { }
                } catch (e) {
                }
            }

            const deleteAvatar = async () => {
                try {
                    loading.value = true
                    await store.dispatch('info/deleteFile')
                    avatarSrc.value = null
                    loading.value = false
                } catch (e) {
                }
            }

            return {
                ...useProfileForm(),
                browse,
                avatarFile,
                avatarSrc,
                changeAvatar,
                deleteAvatar,
                nameAvatar,
                loading
            }
        },
        components: {
            AppAvatar,
            AppLoader
        }
    }
</script>

<style scoped>
    .btn {
        margin-bottom: 20px;
    }

    .switch {
        margin-bottom: 2rem;
    }

    .avatar-container {
        margin-bottom: 10px;
    }

    .avatar {
        position: relative;
        display: inline-block;
        width: 200px;
        height: 200px;
    }

    .avatar-button {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: black;
        opacity: 0;
    }

    .avatar-button:hover {
        opacity: .25;
    }

    .button-camera {
        border-radius: 50%;
        border: none;
        padding: 5px;
        width: 100%;
        height: 100%;
    }

    .button-camera:hover {
        cursor: pointer;
        background-color: gray;
    }

    .button-camera:focus {
        outline: none;
    }
</style>