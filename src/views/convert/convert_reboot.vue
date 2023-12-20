<template>
    <div class="page">
        <header>
            <h1>Please boot into a safe computer without any Arctica hardware wallets inserted and download the latest version of arctica from our website.</h1>
            <h2>Once you run the software, select "Restore From Backup CD"</h2>
            <h2>You may now close this window.</h2>
        </header>
          <div class="btn_container"> 
               <button class="btn" @click="affirm()">I don't have the backup CD</Button>
                
          </div>
    </div>
</template>
    
  <script>
  export default {
    name: 'convertReboot',
    components: {
    },
      methods: {
         affirm(){
          this.$router.push({ name: 'convertBackupCheck' })
          },
        },
      data(){
          return{
          }
      }
  }
  </script>