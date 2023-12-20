<template>
    <div class="page">
        <header>
            <h1>Please reboot this usb stick on a computer with atleast 1 TB of internal storage space.</h1>
        </header>
          <div class="btn_container"> 
               <button class="btn" @click="affirm()">This computer is ready</Button>   
                <button class="btn3">I need help</button>
          </div>
    </div>
</template>
    


<script>
export default {
  name: 'convertFinal',
    methods: {
       affirm(){
        this.$router.push({ name: 'welcome' })
       },
      },
}
</script>