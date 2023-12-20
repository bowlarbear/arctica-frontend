<template>
    <div class="page">
        <header>
            <h1 v-if="this.hotAvail == false">Do you have access to Hardware Wallet 1?</h1>
            <h1 v-else>Please reboot into HW 1</h1>
        </header>
          <div class="btn_container"> 
               <button v-if="this.hotAvail == false" class="btn" @click="affirm()">I have HW 1</Button>
                <button class="btn2" @click="toBackup()">I do not have HW 1</button>
          </div>
    </div>
</template>
    
  <script>
  export default {
    name: 'convertInitial',
    components: {
    },
      methods: {
         affirm(){
            //this should instruct the user to reboot into HW 1
            this.hotAvail = true
          },
          toBackup(){
            //send the user to backup recovery
            this.$router.push({ name: 'convertBackupCheck' })
          }
        },
      data(){
          return{
            hotAvail: false,
          }
      }
  }
  </script>