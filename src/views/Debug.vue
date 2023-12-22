<template>
<hr>
<div class="page">
    <header>
        <h1>Debug Console:</h1>
    </header>
        <h2 v-for="item in this.debug" :key="item">{{item}}</h2>
    <div class="btn_container"> 

        <h2>Arctica Version: 0.1222</h2>

        <h2>Current Route: {{this.$route.name}}</h2>

        <h2>Current HW: {{this.hwNumber}}</h2>

        <h2>setup Step Loaded: {{this.setupStep}}</h2>

        <h4>WARNING: DO NOT TOUCH ANY OF THESE BUTTONS UNLESS YOU KNOW WHAT YOU ARE DOING. YOU HAVE BEEN WARNED. </h4>

        <div class="switch">
            BPS Connection Healthy
            <label class="toggle_switch_label">
                <input v-if="this.bpsHealthy == true" v-model="bpsHealthy" @click="bpsHealthyToggle()" type="checkbox" checked>
                <input v-else-if="this.bpsHealthy == false" v-model="bpsHealthy" @click="bpsHealthyToggle()" type="checkbox">
                <span class="slider"></span>
            </label>
        </div>

        <div class="switch">
            BPS Bricked
            <label class="toggle_switch_label">
                <input v-if="this.bpsBricked == true" v-model="bpsBricked" @click="bpsBrickedToggle()" type="checkbox" checked>
                <input v-else-if="this.bpsBricked == false" v-model="bpsBricked" @click="bpsBrickedToggle()" type="checkbox">
                <span class="slider"></span>
            </label>
        </div>

        <div class="switch">
            Published Privacy Keys Found
            <label class="toggle_switch_label">
                <input v-if="this.privacyKeysFound == true" v-model="privacyKeysFound" @click="privacyKeysFoundToggle()" type="checkbox" checked>
                <input v-else-if="this.privacyKeysFound == false" v-model="privacyKeysFound" @click="privacyKeysFoundToggle()" type="checkbox">
                <span class="slider"></span>
            </label>
        </div>

        <label>Number to Recover</label>
        <select v-model="numberToRecover" name="numberToRecover" id="numberToRecover">
            <option @click="setNumberToRecover()" value=0>Zero</option>
            <option @click="setNumberToRecover()" value=1>One</option>
            <option @click="setNumberToRecover()" value=2>Two</option>
            <option @click="setNumberToRecover()" value=3>Three</option>
            <option @click="setNumberToRecover()" value=4>Four</option>
            <option @click="setNumberToRecover()" value=5>Five</option>
        </select>

        <div class="switch">
            Published Time Machine Keys Found
            <label class="toggle_switch_label">
                <input v-if="this.timeMachineKeysFound == true" v-model="timeMachineKeysFound" @click="timeMachineKeysFoundToggle()" type="checkbox" checked>
                <input v-else-if="this.timeMachineKeysFound == false" v-model="timeMachineKeysFound" @click="timeMachineKeysFoundToggle()" type="checkbox">
                <span class="slider"></span>
            </label>
        </div>    

        <label>Tripped Tripwire</label>
        <select v-model="tripwire" name="tripwire" id="tripwire">
            <option @click="setTripwire()" value="none">None</option>
            <option @click="setTripwire()" value="one">One</option>
            <option @click="setTripwire()" value="two">Two</option>
            <option @click="setTripwire()" value="three">Three</option>
            <option @click="setTripwire()" value="four">Four</option>
            <option @click="setTripwire()" value="five">Five</option>
            <option @click="setTripwire()" value="six">Six</option>
            <option @click="setTripwire()" value="seven">Seven</option>
        </select>

        <div class="switch">
            Post Set up Tripwire Completed
            <label class="toggle_switch_label">
                <input v-if="this.tripwireSetup == true" v-model="tripwireSetup" @click="tripWireSetupToggle()" type="checkbox" checked>
                <input v-else-if="this.tripwireSetup == false" v-model="tripwireSetup" @click="tripWireSetupToggle()" type="checkbox">
                <span class="slider"></span>
            </label>
        </div>

         <div class="switch">
            Post Set up PII Folder Completed
            <label class="toggle_switch_label">
                <input v-if="this.recoverySetup == true" v-model="recoverySetup" @click="recoverySetupToggle()" type="checkbox" checked>
                <input v-else-if="this.recoverySetup == false" v-model="recoverySetup" @click="recoverySetupToggle()" type="checkbox">
                <span class="slider"></span>
            </label>
        </div>

        <div class="switch">
            Post Set up Duress Password Completed
            <label class="toggle_switch_label">
                <input v-if="this.duressSetup == true" v-model="duressSetup" @click="duressSetupToggle()" type="checkbox" checked>
                <input v-else-if="this.duressSetup == false" v-model="duressSetup" @click="duressSetupToggle()" type="checkbox">
                <span class="slider"></span>
            </label>
        </div>

    <button @click="stopBitcoin()" class="btn">Stop Bitcoin</button>
    <br>
    <button @click="getBlockChainInfo()" class="btn">Get Blockchain Info</button>
    <br>
    <button @click="startBitcoinOffline()" class="btn">Start Bitcoind Offline</button>
    <br>
    <button @click="reindexBitcoin()" class="btn">Reindex Bitcoin</button>
    <br>
    <button @click="refreshCD()" class="btn">Refresh CD</button>
    <br> 
    <button @click="unpack()" class="btn">Unpack</button>
    <br> 
    <button @click="packup()" class="btn">Packup</button>
    <br> 
    <button @click="copy_cd_to_ramdisk()" class="btn">Copy CD to ramdisk</button>
    <br> 
    <button @click="pre_setup()" class="btn">go to pre-setup</button>
    <br> 
    <button @click="combine_shards()" class="btn">combine shards</button>


    <nav id="nav">Debug Nav bar (dangerous): 
    <router-link :to="{ name: 'welcome' }">Welcome</router-link> 
    <router-link :to="{ name: 'Boot' }">Boot</router-link> 
    <router-link :to="{ name: 'Login' }">Login</router-link> 
    <router-link :to="{ name: 'BPS_Bricked' }">BPSBricked</router-link> 
    <br>
    <router-link :to="{ name: 'Recovery' }">Recovery</router-link> 
    <router-link :to="{ name: 'RecoveryInitiate' }">RecoveryInitiate</router-link> 
    <router-link :to="{ name: 'RecoveryAdditional' }">RecoveryAdditional</router-link> 
    <router-link :to="{ name: 'RecoveryEvaluate' }">RecoveryEvaluate</router-link> 
    <router-link :to="{ name: 'RecoverySuccess' }">RecoverySuccess</router-link> 
    <br>
    <router-link :to="{ name: 'quick1' }">Quick1</router-link> 
    <router-link :to="{ name: 'quick2' }">Quick2</router-link> 
    <router-link :to="{ name: 'Compromised' }">TripwireCompromised</router-link> 
    <br>
    <router-link :to="{ name: 'dashboard' }">Wallets</router-link>
    <router-link :to="{ name: 'immediate' }">Immediate</router-link>
    <router-link :to="{ name: 'immediateSend' }">ImmediateSend</router-link>
    <router-link :to="{ name: 'immediateReceive' }">ImmediateReceive</router-link>
    <router-link :to="{ name: 'delayed' }">Delayed</router-link>
    <router-link :to="{ name: 'delayedSend' }">DelayedSend</router-link>
    <router-link :to="{ name: 'delayedReceive' }">DelayedReceive</router-link>
    <br>
    <router-link :to="{ name: 'TimeMachine1' }">Time-Machine-1</router-link>
    <router-link :to="{ name: 'TimeMachine2' }">Time-Machine-2</router-link>
    <router-link :to="{ name: 'TimeMachine3' }">Time-Machine-3</router-link>
    <router-link :to="{ name: 'TimeMachine4' }">Time-Machine-4</router-link>
    <router-link :to="{ name: 'TimeMachine5' }">Time-Machine-5</router-link>
    <router-link :to="{ name: 'TimeMachine6' }">Time-Machine-6</router-link>
    <router-link :to="{ name: 'TimeMachine7' }">Time-Machine-7</router-link>
    <router-link :to="{ name: 'TimeMachine8' }">Time-Machine-8</router-link>
    <router-link :to="{ name: 'TimeMachine9' }">Time-Machine-9</router-link>
    <br>
    <router-link :to="{ name: 'Setup1a' }">Setup-1a</router-link>
    <router-link :to="{ name: 'Setup2' }">Setup-2</router-link>
    <router-link :to="{ name: 'Setup3' }">Setup-3</router-link>
    <router-link :to="{ name: 'Setup4' }">Setup-4</router-link>
    <router-link :to="{ name: 'Setup5' }">Setup-5</router-link>
    <router-link :to="{ name: 'Setup6' }">Setup-6</router-link>
    <router-link :to="{ name: 'Setup7' }">Setup-7</router-link>
    <router-link :to="{ name: 'Setup8' }">Setup-8</router-link>
    <router-link :to="{ name: 'Setup9' }">Setup-9</router-link>
    <router-link :to="{ name: 'Setup10' }">Setup-10</router-link>
    <br>
    <router-link :to="{ name: 'Setup11' }">Setup-11</router-link>
    <router-link :to="{ name: 'Setup12' }">Setup-12</router-link>
    <router-link :to="{ name: 'Setup13' }">Setup-13</router-link>
    <router-link :to="{ name: 'Setup14a' }">Setup-14a</router-link>
    <router-link :to="{ name: 'Setup14b' }">Setup-14b</router-link>
    <router-link :to="{ name: 'Setup15a' }">Setup-15a</router-link>
    <router-link :to="{ name: 'Setup15b' }">Setup-15b</router-link>
    <router-link :to="{ name: 'Setup16' }">Setup-16</router-link>
    <router-link :to="{ name: 'Setup17' }">Setup-17</router-link>
    <router-link :to="{ name: 'Setup18a' }">Setup-18a</router-link>
    <router-link :to="{ name: 'Setup18b' }">Setup-18b</router-link>
    <router-link :to="{ name: 'Setup19a' }">Setup-19a</router-link>
    <router-link :to="{ name: 'Setup19b' }">Setup-19b</router-link>
    <br>
    <router-link :to="{ name: 'Setup20a' }">Setup-20a</router-link>
    <router-link :to="{ name: 'Setup20b' }">Setup-20b</router-link>
    <router-link :to="{ name: 'Setup21' }">Setup-21</router-link>
    <router-link :to="{ name: 'Setup23' }">Setup-23</router-link>
    <router-link :to="{ name: 'Setup24' }">Setup-24</router-link>
    <router-link :to="{ name: 'Setup25' }">Setup-25</router-link>
    <router-link :to="{ name: 'Setup26' }">Setup-26</router-link>
    <router-link :to="{ name: 'Setup27a' }">Setup-27a</router-link>
    <router-link :to="{ name: 'Setup27b' }">Setup-27b</router-link>
    <router-link :to="{ name: 'Setup28' }">Setup-28</router-link>
    <router-link :to="{ name: 'Setup29' }">Setup-29</router-link>
    <br>
    <router-link :to="{ name: 'Setup30' }">Setup-30</router-link>
    <router-link :to="{ name: 'Setup31a' }">Setup-31a</router-link>
    <router-link :to="{ name: 'Setup31b' }">Setup-31b</router-link>
    <router-link :to="{ name: 'Setup32' }">Setup-32</router-link>
    <router-link :to="{ name: 'Setup33' }">Setup-33</router-link>
    <router-link :to="{ name: 'Setup34' }">Setup-34</router-link>
    <router-link :to="{ name: 'Setup35a' }">Setup-35a</router-link>
    <router-link :to="{ name: 'Setup35b' }">Setup-35b</router-link>
    <router-link :to="{ name: 'Setup36' }">Setup-36</router-link>
    <router-link :to="{ name: 'Setup37' }">Setup-37</router-link>
    <router-link :to="{ name: 'Setup38' }">Setup-38</router-link>
    <router-link :to="{ name: 'Setup39a' }">Setup-39a</router-link>
    <router-link :to="{ name: 'Setup39b' }">Setup-39b</router-link>
    <br>
    <router-link :to="{ name: 'Setup40' }">Setup-40</router-link>
    <router-link :to="{ name: 'Setup41' }">Setup-41</router-link>
    <router-link :to="{ name: 'Setup42' }">Setup-42</router-link>
    <router-link :to="{ name: 'Setup43a' }">Setup-43a</router-link>
    <router-link :to="{ name: 'Setup43b' }">Setup-43b</router-link>
    <router-link :to="{ name: 'Setup44' }">Setup-44</router-link>
    <router-link :to="{ name: 'Setup45' }">Setup-45</router-link>
    <router-link :to="{ name: 'Setup46' }">Setup-46</router-link>
    <router-link :to="{ name: 'Setup47a' }">Setup-47a</router-link>
    <router-link :to="{ name: 'Setup47b' }">Setup-47b</router-link>
    <router-link :to="{ name: 'Setup48' }">Setup-48</router-link>
    <router-link :to="{ name: 'Setup49a' }">Setup-49a</router-link>
    <router-link :to="{ name: 'Setup49b' }">Setup-49b</router-link>
    <br>
    <router-link :to="{ name: 'Setup50a' }">Setup-50a</router-link>
    <router-link :to="{ name: 'Setup50b' }">Setup-50b</router-link>
    <router-link :to="{ name: 'Setup51' }">Setup-51</router-link>
    <br>
    <router-link :to="{ name: 'tripwirePostSetup1' }">Tripwire-Post-Setup-1</router-link>
    <router-link :to="{ name: 'tripwirePostSetup2' }">Tripwire-Post-Setup-2</router-link>
    <router-link :to="{ name: 'duressPostSetup1' }">Duress-Post-Setup-1</router-link>
    <router-link :to="{ name: 'piiPostSetup1' }">Recovery-Post-Setup-1</router-link>
    <router-link :to="{ name: 'piiPostSetup2' }">Recovery-Post-Setup-2</router-link>
    <router-link :to="{ name: 'piiPostSetup3' }">Recovery-Post-Setup-3</router-link>
  </nav>
    </div> 
</div>
</template>

<script>
import store from '../store.js'
const invoke = window.__TAURI__.invoke

export default{
    name: 'Debug',
    methods:{
        combine_shards(){
            invoke('combine_shards').then((res)=>{
                store.commit('setDebug', `combining shards: ${res}`)
            }).catch((e)=>{
                store.commit('setDebug', `error combining shards ${e}`)
            })
        },
        pre_setup(){
            this.$router.push({ name:'Pre-Setup1' })
        },
        timeLockToggle(){
            if(this.timelock === false){
                store.commit('setTimeLock', true)
                store.commit('setTimeMachineKeysFound', false)
            }
            else{
                store.commit('setTimeLock', false)
            }
        },
        setTripwire(){
            store.commit('setTripwireTripped', this.tripwire)
            this.tripwire = store.getters.getTripwireTripped
        },
        bpsBrickedToggle(){
            if(this.bpsBricked == false){
                store.commit('setBPSBricked', true)
            } else{
                store.commit('setBPSBricked', false)
            }
            },
            //this function automatically sets timelock to false, assuming that time machine keys have ben found, time lock should be disabled automatically
        timeMachineKeysFoundToggle(){
            if(this.timeMachineKeysFound == false){
                store.commit('setTimeMachineKeysFound', true)
                store.commit('setTimeLock', false)
            } else{
                store.commit('setTimeMachineKeysFound', false)
            }
            },
        privacyKeysFoundToggle(){
            if(this.privacyKeysFound == false){
                store.commit('setPrivacyKeysFound', true)
                store.commit('setDecrypted',true)
            } else{
                store.commit('setPrivacyKeysFound', false)
                store.commit('setDecrypted', false)
            }
            },
        tripWireSetupToggle(){
                if(this.tripwireSetup == false){
                store.commit('setTripwireSetup', true)
            } else{
                store.commit('setTripwireSetup', false)
            }
        },
        recoverySetupToggle(){
                if(this.recoverySetup == false){
                store.commit('setRecoverySetup', true)
            } else{
                store.commit('setRecoverySetup', false)
            }
        },
        duressSetupToggle(){
                if(this.duressSetup == false){
                store.commit('setDuressSetup', true)
            } else{
                store.commit('setDuressSetup', false)
            }
        },
        btcCoreHealthyToggle(){
                if(this.btcCoreHealthy == false){
                store.commit('setBTCCoreHealthy', true)
            } else{
                store.commit('setBTCCoreHealthy', false)
            }
        },
        bpsHealthyToggle(){
                if(this.bpsHealthy == false){
                store.commit('setBPSHealthy', true)
            } else{
                store.commit('setBPSHealthy', false)
            }
        },   
        refreshCD(){
        //this is a debug function used to refresh the CD with the current contents of /mnt/ramdisk/CDROM
            invoke('refresh_cd', {psbt: false}).then((res)=>{
                store.commit('setDebug', `refreshing CD: ${res}`)
            }).catch((e)=>{
                store.commit('setDebug', `error refreshing CD ${e}`)
            })
        },
        unpack(){
            //this is a debug function used to unpack the encrypted tarball into /mnt/ramdisk/sensitive
            invoke('unpack').then((res)=>{
                store.commit('setDebug', `unpacking tarball: ${res}`)
            }).catch((e)=>{
                store.commit('setDebug', `error unpacking tarball ${e}`)
            })
        },
        packup(){
            //this is a debug function used to packup the contents of /mnt/ramdisk/sensitive into an encrypted tarball
            invoke('packup', {hwnumber: this.hwNumber.toString()}).then((res)=>{
                store.commit('setDebug', `packing up tarball: ${res}`)
            }).catch((e)=>{
                store.commit('setDebug', `error packing up tarball ${e}`)
            })
        },
        getTransctionHistory(){
            //this is a debug function used to print the immediate wallet transaction history vec
            invoke('get_transactions', {walletname: "immediate", hwnumber: this.hwNumber.toString()}).then((res)=>{
                store.commit('setDebug', `obtaining transaction history for immediate wallet: ${res}`)
            })
            .catch((e)=>{
                store.commit('setDebug', `error obtaining transactions for immediate wallet: ${e}`)
            })
        },
        decodeRawTx(){
            //debug function used to decode a signed PSBT
            invoke('decode_processed_psbt', {walletname: "immediate", hwnumber: this.hwNumber.toString()}).then((res)=>{
                store.commit('setDebug', `decoding PSBT from CDROM`)
                store.commit('setDebug', `decoded psbt: ${res}`)
            }).catch((e) => {
                    store.commit('setDebug', `error decoding PSBTs: ${e}`)
            })
        },
        copy_cd_to_ramdisk(){
            invoke('copy_cd_to_ramdisk').then((res)=>{
                store.commit('setDebug', `copying CD to ramdisk: ${res}`)
            })
        },
        reboot(){
            store.commit('setDebug', 'Reboot button pushed, Sending user to welcome')
            this.$router.push({ name: 'welcome' })
        },
        setNumberToRecover(){
            store.commit('setNumberToRecover', this.numberToRecover)
        },
        reindexBitcoin(){
            invoke('start_bitcoind', {reindex: true, networkactive: true, wallets: true}).then((res)=>{
                store.commit('setDebug', `starting bitcoind and reindexing blocksdb: ${res}`)
                store.commit('setDebug', 'starting check sync status')
                invoke('check_bitcoin_sync_status').then((res)=>{
                    store.commit('setDebug', `sync successful${res}`)
                }).catch((e)=>{
                    store.commit('setDebug', `Error checking sync status: ${e}`)
                })
            }).catch((e)=>{
                store.commit('setDebug', `Error reindexing blocksdb: ${e}`)
            })
        },
        startBitcoinOffline(){
            invoke('start_bitcoind', {reindex: false, networkactive: false, wallets: true}).then((res)=>{
                store.commit('setDebug', `starting bitcoind with network disabled: ${res}`)
            }).catch((e)=>{
                store.commit('setDebug', `Error starting bitcoind with network disabled: ${e}`)
            })
        },
        stopBitcoin(){
            invoke('stop_bitcoind').then((res)=>{
                store.commit('setDebug', `stopping Bitcoin daemon: ${res}`)
            }).catch((e)=>{
                store.commit('setDebug', `Error stopping Bitcoin Daemon: ${e}`)
            })
        }
    },
    computed:{
        debug(){
            return store.getters.getDebug
        },
        setupStep(){
            return store.getters.getSetupStep
        },
        timelock:{
            get(){
                return store.getters.getTimeLock
            },
            set(newVal){
                store.commit('setTimeLock', newVal)
            }
        },
        tripwire:{
            get(){
                return store.getters.getTripwireTripped
            },
            set(newVal){
                store.commit('setTripwireTripped', newVal)
            }
        },
        hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
        numberToRecover:{
            get(){
                return store.getters.getNumberToRecover
            },
            set(newVal){
                store.commit('setNumberToRecover', newVal)
            }
        },
        bpsBricked:{
            get(){
                return store.getters.getBPSBricked
            },
            set(newVal){
                store.commit('setBPSBricked', newVal)
            }
        },
        timeMachineKeysFound:{
            get(){
                return store.getters.getTimeMachineKeysFound
            },
            set(newVal){
                store.commit('setTimeMachineKeysFound', newVal)
            }
        },
        privacyKeysFound:{
            get(){
                return store.getters.getPrivacyKeysFound
            },
            set(newVal){
                store.commit('setPrivacyKeysFound', newVal)
            }   
        },
        tripwireSetup:{
            get(){
                return store.getters.getTripwireSetup
            },
            set(newVal){
                store.commit('setTripwireSetup', newVal)
            }
        },
        recoverySetup:{
            get(){
                return store.getters.getRecoverySetup
            },
            set(newVal){
                store.commit('setRecoverySetup', newVal)
            }
        },
        duressSetup:{
            get(){
                return store.getters.getDuressSetup
            },
            set(newVal){
                store.commit('setDuressSetup', newVal)
            }
        },
        bpsHealthy:{
            get(){
                return store.getters.getBPSHealthy
            },
            set(newVal){
                store.commit('setBPSHealthy',newVal)
            }
        },
        deviceList:{
            get(){
                return store.getters.getDeviceList
            },
            set(newVal){
                store.commit('setDeviceList', newVal)
            }
        },
    },
    }
</script>

<style scoped>
.toggle_switch_label{
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}
.toggle_switch_label input{
    opacity: 0;
    width: 0;
    height: 0;
}
.slider{
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 34px;
}
.slider:before{
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
}
input:checked + .slider{
    background-color:#F7931A;
}
input:focus + .slider{
    box-shadow: 0 0 1px #F7931A;
}
input:checked + .slider:before{
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}
select{
    max-width:20%;
}
.switch{
    display:flex;
    flex-direction: row;
    align-items:center;
}
</style>