  <template>
<div class="page">
    <div class="outer_container">
        <div class="send_head_container">
         <h1>Send Bitcoin</h1>
         </div>
    <div class="send_container">
        <div class="send_form">
            <label>Description</label>
            <br><input v-model="description" type="text" placeholder="What is this transaction for?">

            <br><label>Address</label>
            <br><input v-model="address" type="text" required placeholder="Enter Address"> 

            <br><label>Amount</label>
            <br><input v-model="balance" type="float" required placeholder="₿ 0.00">
            <!-- Need to implement a 2 way bind here and reference it against an exchange API so we can dynamically calucate the BTC or Fiat amount against whatever the user inputs -->

            <div class="balance_calculator">
                <div class="balance_left">
                <h2>Your Balance</h2>
                <h3>₿ {{ quickBalance }}</h3>
                </div>
                <div class="balance_right">
                    <button @click="selectMax()" class="btn4">Select Max</button>
                </div>
            </div>
            
            <br><label>Fee</label>
            <br><select v-model="fee" name="fee" id="fee" required>
                <option @click="customDisable()" value="high">High Priority {{ highFee }} sat/Byte</option>
                <option @click="customDisable()" value="medium">Medium Priority {{ mediumFee }} sat/Byte</option>
                <option @click="customDisable()" value="low">Low Priority {{ lowFee }} sat/Byte</option>
                <option @click="customEnable()" value="custom">Custom (Advanced)</option>
            </select>
            <br><label v-if="custom == true">Sats per Byte</label>
            <br><input v-if="custom == true" v-model="customFee" type="integer" placeholder="Sats per Byte">

        </div>
    </div>
        <div class="send_button_container">
            <button @click="goBack()" class="btn2">Go back</button>
            <button @click="continueFn(description, address, balance, fee, customFee)" class="btn">Continue</Button>
        </div>
    </div>        
</div>
</template>


<script>    
import store from '../../store.js'

export default {
  name: 'quick2',
  components: {
  },
    methods: {
        continueFn(description, address, balance, fee, customFee){
            this.transaction = {id:100, description:description, address:address, balance:balance, fiat_currency:(20000*balance), datetime:'07oct20221000', fee:fee, customFee:customFee, status: 'unconfirmed'}
            this.txConstructed(this.transaction)
        },
        // eventually the continueFn() should construct and return the PSBT
        txConstructed(transaction){
            this.constructed = transaction
        },
              goBack(){
            this.$router.push({ name: 'welcome' })
        },
        selectMax(){
            this.balance = this.quickBalance
        },
        customEnable(){
            this.custom = true
        },
        customDisable(){
            this.custom = false
        },
        closeOut(){
          this.constructed = false
      },
    },
   data(){
     return{
         highFee: 12,
         mediumFee: 5,
         lowFee: 1,
         description: '',
         address: '',
         balance: '',
         fee: 'high',
         customFee: '',
         custom: false,
         transaction: {},
         constructed: false,
     }
    //  Need a function to deliver dynamic fee estimates for the above data
 },
 computed:{
    quickBalance(){
        return store.getters.getQuickBalance
    }
 }
}
</script>


<style>
  </style>
