<template>
    <div v-if="this.loading ==true">
    <Loader />
    </div>
    <div v-else class="page">
        <header>
        <h1>CD 7 Backup</h1>
        <h2>Please remove the Set up CD and insert CD 7.</h2>
        <h4 v-if="badCD == true">* Setup CD detected! Please remove.</h4>
        <h4 v-if="noCD == true">* Error reading CD, please remove and reinsert.</h4>
    </header> 
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have inserted CD 7.</label>
            </div>
        </form>
        <div class="btn_container"> 
            <button v-if="this.hwNumber == 7 && checkbox" @click="acknowledge()" class="btn">Proceed</Button>
            <button v-else @click="warn()" class="btn3">Proceed</Button>
        </div>
    </div> 


</div>
<ProgressBar/>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'
import store from '../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
  name: 'Setup47b',
  components: {
    Loader,
    ProgressBar
  },
      methods: {
        acknowledge(){
            this.badCD = false
            this.noCD = false
            this.loading = true
            store.commit('setLoadMessage', 'Reading CD...')
            //read the CD to verify the user has not inserted the setup CD
            invoke('read_cd').then((res) => {
                store.commit('setDebug', `invoking read_cd: ${res}`)
                let resArray = res.split("\n")
                store.commit('setDebug', `response Array: ${resArray}`)
                for(let i = 0; i < resArray.length; i ++){
                    let it = resArray[i].split("=")
                    store.commit('setDebug', `for loop number: ${i+1}; key: ${String(it[0]).toUpperCase()} value: ${it[1]}`)
                    //check for setup CD
                    if (String(it[0]).toUpperCase() == 'TYPE' && String(it[1]).toUpperCase() == 'SETUPCD'){
                        store.commit('setSetupCD', true)
                        store.commit('setDebug', `Set up CD detected, boolean set to true ${store.getters.getSetupCD}`)
                        this.loading = false
                        this.badCD = true
                        break
                    }
                    else{
                        store.commit('setDebug', `fall back inside for loop triggered; key: ${String(it[0]).toUpperCase()} value: ${String(it[1]).toUpperCase()}`)
                        store.commit('setLoadMessage', 'Creating Backup...')
                        //make a backup dir and fill it with a backup of the current Hardware Wallet
                        invoke('create_backup', {number: "7"}).then((res) => {
                            store.commit('setDebug', `creating and filling backup dir ${res}`)
                            //make and burn backup ISO
                            invoke('make_backup', {number: "7"}).then((res) => {
                                this.loading = false
                                store.commit('setDebug', `making and burning backup iso ${res}`)
                                this.$router.push({ name: 'Setup48' })
                            }).catch((e) => {
                                store.commit('setDebug', `error making and burning backup iso: ${e}`)
                                store.commit('setErrorMessage', `Error making backup Error code: Setup47b-1 Response: ${e}`)
                                this.$router.push({ name:'Error' })
                            })
                        }).catch((e) => {
                            store.commit('setDebug', `error creating and filling backup dir: ${e}`)
                            store.commit('setErrorMessage', `Error creating backup Error code: Setup47b-2 Response: ${e}`)
                            this.$router.push({ name:'Error' })
                        })
                        break
                    }
                }
            }).catch((e)=> {
            store.commit('setDebug', `error reading setup CD Setup47b-8: ${e}`)
            this.noCD = true
            this.loading = false
            })
        },
        warn(){
        },
    },
    mounted(){
        this.loading = true
        store.commit('setLoadMessage', 'starting bitcoin daemon...')
        //start bitcoind with networking disabled
        invoke('start_bitcoind', {reindex: false, networkactive: false, wallets: true})
        store.commit('setDebug', `starting bitcoin daemon with networking disabled:`)
        store.commit('setLoadMessage', 'Copying Setup CD...')
        //copy everything from the setup CD to ramdisk
        invoke('copy_cd_to_ramdisk').then((res) => {
            store.commit('setDebug', `reading setup CD ${res}`)
            store.commit('setLoadMessage', 'Unpacking Sensitive Data...')
            //unpack() the encrypted tarball
            invoke('unpack').then((res) => {
                store.commit('setDebug', `unpacking sensitive info ${res}`)
                store.commit('setLoadMessage', 'Creating Descriptors...')
                //create the descriptors
                invoke('create_descriptor', {hwnumber: "7"}).then((res) => {
                    store.commit('setDebug', `creating descriptors ${res}`)
                    store.commit('setLoadMessage', 'Packing up sensitive data...')
                    //make sure sensitive contains everything it should before packup()
                    invoke('packup', {hwnumber: this.hwNumber.toString()}).then((res) => {
                        store.commit('setDebug', `packing up sensitive info ${res}`)
                        invoke('eject_cd').then((res)=>{
                            store.commit('setDebug', `ejecting CD: ${res}`)
                            this.loading=false
                        }) .catch((e)=>{
                            store.commit('setDebug', `error ejecting cd: ${e}`)})
                    }).catch((e) => {
                        store.commit('setDebug', `error packing up sensitive info: ${e}`)
                        store.commit('setErrorMessage', `Error packing up Error code: Setup27b-4 Response: ${e}`)
                        this.$router.push({ name:'Error' })
                        })        
                }).catch((e) => {
                    store.commit('setDebug', `error creating descriptors: ${e}`)
                    store.commit('setErrorMessage', `Error creating descriptors Error code: Setup27b-6 Response: ${e}`)
                    this.$router.push({ name:'Error' })
                    })
            }).catch((e) => {
                store.commit('setDebug', `error unpacking sensitive info: ${e}`)
                store.commit('setErrorMessage', `Error unpacking Error code: Setup27b-5 Response: ${e}`)
                this.$router.push({ name:'Error' })
                })
        }).catch((e) => {
            store.commit('setDebug', `error reading setup CD: ${e}`)
            store.commit('setErrorMessage', `Error reading setup CD Error code: Setup27b-7 Response: ${e}`)
            this.$router.push({ name:'Error' })
            })
    },
    data(){
        return{
            checkbox: false,
            loading: false,
            badCD: false,
            noCD: false,
        }
    },
        computed:{
            hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
    }
}
</script>

