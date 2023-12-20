<template>
    <div class="page">
        <header>
            <h1>Please connect to a network.</h1>

        </header>
          <div class="btn_container"> 
               <button class="btn" @click="affirm()">Ok</Button>
                
          </div>
    </div>
</template>
    
  <script>
  //this is where we will start the conversion process where we awaken the users current HW by having them connect to a network and then obtain some depdendencies
  //and connect with the BPS
  //note we need to first enable networking
  export default {
    name: 'convertStart',
    components: {
    },
      methods: {
         affirm(){
          },
        },
      data(){
          return{
          }
      },
      mounted(){}
  }
  </script>