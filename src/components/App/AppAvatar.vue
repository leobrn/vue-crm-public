<template>
    <img :src="src"
         :style="{
            width: size + 'px',
            height: size + 'px'}"
         class="circle responsive-img avatar-img"
         v-if="src">
    <div class="circle" :style="{
        width: size + 'px',
        height: size + 'px',
        backgroundColor: color
    }" v-else>
        <span class="initials" :style="{
            fontSize: size / 2 + 'px',
            top: size / 4 + 'px'
        }">{{avatarName}}</span>
    </div>
</template>

<script>
    import {ref, onMounted, watch, computed} from 'vue'

    export default {
        props: {
            size: {
                type: Number,
                required: true
            },
            src: {
                type: String
            },
            name: {
                type: String,
                default: ''
            }
        },
        setup(props) {
            const coloursMap = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d']
            const name = computed(() => props.name)
            const color = ref('#fff')
            const avatarName = ref('')

            const initAvatar = () => {
                if (!name.value || name.value.length === 0) {
                    return
                }
                const nameSplit = name.value.split(' ')
                let initials = ''

                if (nameSplit.length > 1) {
                    initials = nameSplit[0].charAt(0).toUpperCase()
                        + nameSplit[1].charAt(0).toUpperCase()
                } else {
                    initials = nameSplit[0].charAt(0).toUpperCase()
                }

                const charIndex = initials.charCodeAt(0) - 64
                const colourIndex = charIndex % coloursMap.length

                color.value = coloursMap[colourIndex - 1]
                avatarName.value = initials
            }

            onMounted(() => {
                initAvatar()
            })

            watch(props, () => {
                initAvatar()
            })

            return {
                avatarName,
                color
            }
        }
    }
</script>

<style scoped>
    .circle {
        background-color: #ccc;
        border-radius: 50%;
        text-align: center;
    }

    .initials {
        line-height: 1;
        position: relative;
        color: white;
    }

    .avatar-img {
        object-fit: cover;
    }
</style>