<template>
<button @click="onClick()" class="btn">{{ text }}</button>
</template>

<script>
export default{
    name: 'Button_primary',
    props: {
        text: String,
    },
    methods: {
        onClick(){
        }
    },
}
</script>