<template>
<button @click="onClick()" class="btn2">{{ text }}</button>
</template>

<script>
export default{
    name: 'Button_secondary',
    props: {
        text: String,
    },
    methods: {
        onClick(){
        }
    },
}
</script>