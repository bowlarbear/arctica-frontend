<template>
    <div class="page">
        <header>
            <h1>Do you have access to the backup CD, DVD or M-DISC with the number 1 written on it?</h1>
            <h2>This is a backup of the contents cotained on HW 1. </h2>
        </header>
          <div class="btn_container"> 
               <button @click="affirm()" class="btn">Yes</Button>
                <button class="btn2" @click="goHome()">No</button>
          </div>
    </div>
</template>
    
  <script>
  export default {
    name: 'convertBackupCheck',
    components: {
    },
      methods: {
         affirm(){
            //this should send the user to a screen which informs them to start their computer normally and download the latest version of Arctica
            //once at the boot screen for a fresh arctica binary they will need to select the "Restore a Backup CD"
            this.$router.push({ name: 'convertReboot' })
          },
          goHome(){
            this.$router.push({ name: 'convertConfirmation' })
          }
        },
      data(){
          return{
          }
      }
  }
  </script>