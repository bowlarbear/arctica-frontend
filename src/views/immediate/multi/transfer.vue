<template>
<div v-if="this.loading == true">
  <Loader/>
  </div>
<div v-else class="page">
    <header>
        <h1>Please insert a Transfer CD</h1>
        <h2>This is a blank CD that you will destroy after sending your transaction.</h2>
        <h4 v-if="this.badExport == true">*Error exporting transaction, please reinsert the CD and try again</h4>
    </header>
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have inserted a transfer CD.</label>
                </div>
        </form>
        <div class="btn_container"> 
            <button v-if="checkbox" @click="acknowledge()" class="btn">Continue</Button>
            <button v-else @click="warn()" class="btn3">Continue</Button>
        </div>
    </div> 
</div>
</template>

<script>
import store from '../../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke


export default {
  name: 'immediateTransfer',
  components: {
    Loader,
  },
    methods: {
        acknowledge(){
            this.loading=true
            store.commit('setLoadMessage', 'Exporting PSBT...')
            invoke('export_psbt', {progress: "1of2"}).then((res) => {
                store.commit('setDebug', `Exporting PSBT: ${res}`)
                invoke('refresh_cd', {psbt: true}).then((res)=>{
                store.commit('setDebug', `refreshing CD: ${res}`)
                this.loading=false
                //send the user to the correct success screen after export is complete
                this.$router.push({name: '1of2success'})
                }).catch((e)=>{
                    store.commit('setDebug', `error refreshing CD ${e}`)
                    this.badExport = true
                    this.loading = false
                })
            })
            .catch((e) => {
                store.commit('setDebug', `Error Exporting PSBT: ${e}`)
                this.badExport = true
                this.loading = false
            })
        },
                warn(){
        },

    },
    computed:{
    },
    data(){
        return{
            checkbox:false,
            loading: false,
            badExport: false
        }
    }
}
</script>


