<template>
<div class="page">
    <header>
        <h1>This is a test environment</h1>
        <h2>Make sure Bitcoin Core is running...I won't do it for you.</h2>
        <h2>Make sure you have the right file structures in /mnt/ramdisk...I won't do it for you.</h2>
    </header>

    <header>
    <h3>Balance: {{ balance }}</h3>
    <h3>Receive Address: {{ address }}</h3>
    </header>
    <div class="btn_container"> 

        <label>HW inserted</label>
            <select v-model="hwNumber" name="hwNumber" id="hwNumber">
                <option @click="setHW()" value= 0>None</option>
                <option @click="setHW()" value= 1>One</option>
                <option @click="setHW()" value= 2>Two</option>
                <option @click="setHW()" value= 3>Three</option>
                <option @click="setHW()" value= 4>Four</option>
                <option @click="setHW()" value= 5>Five</option>
                <option @click="setHW()" value= 6>Six</option>
                <option @click="setHW()" value= 7>Seven</option>
            </select>

        <button @click="get_address()" class="btn">Receive Address</button>
        <br> 
        <button @click="get_balance()" class="btn">Check Balance</button>
        <br>         
        <button @click="generateKeys()" class="btn">Gen Keys</button>
        <br> 
        <button @click="timeMachineKeys()" class="btn">Time Machine Keys</button>
        <br>
        <button @click="createDescriptors()" class="btn">Create Descriptors</button>
        <br>
    </div>
    
</div>
</template>
    
<script> 
import store from '../store.js'
const invoke = window.__TAURI__.invoke   

export default {
    name: 'TestEnvironment',
    methods: {
        setHW(){
            store.commit('setCurrentHW', this.hwNumber)
        },
        get_address(){
            invoke('get_address', {walletname: "immediate", hwnumber: this.hwNumber.toString()}).then((res)=>{
                store.commit('setDebug', `getting new address for immediate wallet: ${res}`)
                this.address = res
            })
        },
        get_balance(){
            invoke('get_balance', {walletname: "immediate", hwnumber: this.hwNumber.toString()}).then((res)=>{
                    store.commit('setDebug', `getting balance for immediate wallet: ${res}`)
                    this.balance = parseFloat(res)
                })
        },
        generateKeys(){
            invoke('generate_store_key_pair', {number: this.hwNumber.toString()}).then((res)=>{
                store.commit('setDebug', `invoking generate store keypair: ${res}`)
                store.commit('setDebug', `generating key: ${this.hwNumber}`)
                    })
            .catch((e)=>{
            store.commit('setDebug', `error invoking test function: ${e}`)
            })
        },
        createDescriptors(){
            invoke('create_descriptor', {hwnumber: this.hwNumber.toString()}).then((res) => {
                store.commit('setDebug', `creating descriptors ${res}`)
            }).catch((e) => {
                    store.commit('setDebug', `error creating descriptors: ${e}`)
            })
        },
        timeMachineKeys(){
            invoke('generate_store_simulated_time_machine_key_pair', {number: '1'}).then((res)=>{
                    store.commit('setDebug', `Generating simulated time machine key pair 1: ${res}`)
                    invoke('generate_store_simulated_time_machine_key_pair', {number: '2'}).then((res)=>{
                        store.commit('setDebug', `Generating simulated time machine key pair 2: ${res}`)
                        invoke('generate_store_simulated_time_machine_key_pair', {number: '3'}).then((res)=>{
                            store.commit('setDebug', `Generating simulated time machine key pair 3: ${res}`)
                            invoke('generate_store_simulated_time_machine_key_pair', {number: '4'}).then((res)=>{
                                store.commit('setDebug', `Generating simulated time machine key pair 4: ${res}`)
                            })
                            .catch((e)=>{
                                store.commit('setDebug', `error generating time machine key pair 4 ${e}`)
                                store.commit('setErrorMessage', `Error creating time machine key Error code: Setup12-2 Response: ${e}`)
                                this.$router.push({ name:'Error' })
                            })  
                        })
                        .catch((e)=>{
                            store.commit('setDebug', `error generating time machine key pair 3 ${e}`)
                            store.commit('setErrorMessage', `Error creating time machine key Error code: Setup12-3 Response: ${e}`)
                            this.$router.push({ name:'Error' })
                        })  
                    })
                    .catch((e)=>{
                        store.commit('setDebug', `error generating time machine key pair 2 ${e}`)
                        store.commit('setErrorMessage', `Error creating time machine key Error code: Setup12-4 Response: ${e}`)
                        this.$router.push({ name:'Error' })
                    })  
            })
            .catch((e)=>{
                store.commit('setDebug', `error generating time machine key pair 1 ${e}`)
                store.commit('setErrorMessage', `Error creating time machine key Error code: Setup12-5 Response: ${e}`)
                this.$router.push({ name:'Error' })
            })  
        }
    },
    computed: {
        hwNumber:{
            get(){
                return store.getters.getCurrentHW
            },
            set(newVal){
                store.commit('setCurrentHW', newVal)
            }
        },
    },
    data(){
        return{
            address: 'None',
            balance: 0,
        }
    }
}
</script>

<style scoped>
select{
    max-width:20%;
}
</style>