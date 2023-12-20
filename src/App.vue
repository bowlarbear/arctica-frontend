<template>
<div class="page">
  <div class="debug-button-container">
    <button @click="debugToggle()" class="debug-button">Show Debug</button>
  </div>
  <router-view/>
  <Debug v-if="this.showDebug"/>
</div>
</template>


<script>
import { RouterView, RouterLink } from "vue-router";
{
  RouterView;
  RouterLink
}
import Debug from './views/Debug.vue'
import store from './store.js'

export default {
  name: 'App',
  components: {
    Debug
  },
  computed:{
        showDebug(){
            return store.getters.getShowDebug
        },
      },
      methods:{
        debugToggle(){
      if(this.showDebug == true){
        store.commit('setShowDebug', false)
        store.commit('setDebug', "Toggling showDebug")
      }else{
        store.commit('setShowDebug', true)
        store.commit('setDebug', "Toggling showDebug")
      }
      
    },
      },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&display=swap');

.debug-button-container {
  position: absolute;
  top: 10px;
  right: 10px;
}

.debug-button {
  background-color: rgba(211, 211, 211, 0.3); /* Light grey and semi-transparent */

  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.3);
  transition: 0.2s;
}

.debug-button:hover {
  background-color: rgba(211, 211, 211, 0.7);
}
#app {
  font-family: 'Inter';
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  color: #2c3e50;
  background: #FFFFFF;
}
hr {
       display: block;
       position: relative;
       padding: 0;
       margin: 8px auto;
       height: 0;
       width: 100%;
       max-height: 0;
       font-size: 1px;
       line-height: 0;
       clear: both;
       border: none;
       border-top: 1px solid #aaaaaa;
       border-bottom: 1px solid #ffffff;
  }
.btn {
  background: #F7931A;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius:5px;
  color: #FFFFFF;
  width: 335px;
  height: 46px;
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
}
.btn:hover{
  cursor:pointer;
}
.btn2 {
  background: #FFFFFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius:5px;
  color: #000000;
  width: 335px;
  height: 46px;
  font-size: 18px;
  line-height: 18px;
}
.btn2:hover{
  cursor:pointer;
}
.btn3 {
  background: #DEDEDE;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius:5px;
  color: #FFFFFF;
  width: 335px;
  height: 46px;
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
}
.btn4 {
  background: #FFFFFF;
  color: #000000;
  width: 150px;
  height: 46px;
  font-size: 18px;
  line-height: 18px;
  margin-right: 10px;
}
.btn5{
    padding:5px;
}
.btn6 {
  background: #DEDEDE;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius:5px;
  color: #FFFFFF;
  width: 335px;
  height: 46px;
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
}
.btnclose{
    background-color: #FFFFFF;
    width: auto;
    height: fit-content;
    border:none;
    display:flex;
    flex-direction: row;
    align-items: center;
    align-content: center;
    font-weight:500;
    font-size:18px;
    line-height: 18px;
}
.btnclose:hover{
  cursor:pointer;
}
.btn_container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items:center;
  align-items: center;
  padding: 0px;
  gap: 21px;
}
.btn_approve{
    display:flex;
    justify-content: center;
    align-content: center;
    align-items: center;
}
.horizontal_btn_container{
    margin-top: 2%;
}
#nav{
  margin-top:60px;
  padding:5px;
  width:100%;
}
#nav a{
  padding:5px;
}
.page{
  width:100%;
}
a{
  text-decoration: inherit;
  color: inherit;
}
::placeholder{
    color:#BBBBBB
}
.blue_link{
    color:#2D9CDB;
}
.form_container{
    display: flex;
    flex-direction: column;
    gap: 25px;
}

#copy{
    display:flex;
    flex-direction: row;
    padding-bottom: 10px;
}
#copy:hover{
    cursor:pointer
}
#copy_text:hover{
    cursor:pointer;
}
#download{
    display:flex;
    flex-direction: row;
    padding-bottom: 10px;
}
#download:hover{
    cursor:pointer
}
#download_text:hover{
    cursor:pointer;
}
input{
    display: block;
    padding: 10px 50px 10px 10px;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ddd;
    font-size: 18px;
    font-weight:400;
    line-height:140%; 
}
input[type="checkbox"] {
  display: inline-block;
  width:16px;
  margin: 0 10px 0 0;
  position: relative;
  top: 5px;
}
select{
    display: block;
    padding: 10px 50px 10px 10px;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ddd;
    background-color:#FFFFFF;
    
}
.checkbox_container{
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-items:center;
    width:100%;
}
.lg_checkbox_container{
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-items:center;
    width:100%;
    margin-left:10%; 
}
form{
    max-width:420px;
    margin: 10px auto;
    text-align: left;
    padding:10px;
}
.device_form{
  display:flex;
  flex-direction: column;
  max-width:10%;
  margin: 10px auto;
  padding:10px;
}
.device_container{
  display:flex;
  flex-direction: row;
  align-items: center;
  width:100%;
  max-width: 100%;
}
.send_form{
    max-width:70%;
    width: 60%;
    margin: 10px auto;
    text-align: left;
    padding-top:5px;
    padding-left:15px;
    padding-right:15px;
    padding-bottom:15px;
}
label{
    display:inline-block;
    margin: 25px 0 15px;
    font-size: 20px;
}
.device_label{
    position: relative;
    display: inline-block;
}
.device_input{
  width: 35%;
}
header{
    display:flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content:center;
    padding: 0px 0px 25px;
    margin: 0 auto;
    margin-top: 5%;
    width:19%;
}
.head_container{
  border-style: solid; 
  border-width: 0px 0px 1px 0px;
  border-color: #DEDEDE;
  width: 80%;
  margin-top: 40px;
  padding:10px;
}
.receive_head_container{
  width: 30%;
  margin-top: 40px;
  padding:10px;
}
.send_head_container{
margin: 0 auto;
width: 44%;
margin-top: 40px;
padding:10px;
}
.balance_overview{
  color:#404040;
  text-align:right;
}
.wallet_container{
  display:flex;
  flex-direction: row;
  border-style: solid; 
  border-width: 0px 0px 1px 0px;
  border-color: #DEDEDE;
  width: 80%;
}
.wallet_container_left{
  display:flex;
  flex-direction: column;
  align-items:flex-start;
  width:50%;
}
.wallet_container_right{
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items:center;
  align-content:center;
  width:50%;
}
.carat{
  margin-top:0.5%;
}
.wallet_container{
  display:flex;
  flex-direction: row;
  border-style: solid; 
  border-width: 0px 0px 1px 0px;
  border-color: #DEDEDE;
  width: 80%;
}
h1{
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 140%;
    text-align:left;
}
h2{
    font-family: 'Inter';
    font-style: normal;
    color: #777777;
    font-weight: 400;
    font-size: 18px;
    line-height: 140%;
    text-align:left;
}
h3{
    font-family: 'SF Pro Display';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 140%;
}
h4{
    color:red;
    font-family: 'SF Pro Display';
    font-style: normal;
    font-weight: 800;
    font-size: 18px;
    line-height: 140%;
}
.dashboard{
  display:flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  width:65%;
  margin-left:20%;
}
.settings_dashboard{
  display:flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  width:40%;
  margin-left:30%;
}
.display_block{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    padding: 4%;
    width: 40%;
}
.description_block{
    display:flex;
    align-self:center;
    justify-self:center;
    width:100%;
}
.footer_block{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-content:center;
    align-items:center;
    width:90%;
}
.transaction_head{
    display:flex;
    flex-direction: row;
    width:100%;
    justify-content: space-between;
    
}
.tx_block{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-content:center;
    width:90%;
    border-style: solid; 
    border-width: 0px 0px 1px 0px;
    border-color: #DEDEDE;
}
.nav_container{
    width:100%;
    height: 100px;
    border-style: solid; 
    border-width: 0px 0px 1px 0px;
    border-color: #DEDEDE;
    margin-top:10px;
}
.icon_container{
    display:flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    align-content:center;
    padding:5px;
}
.refresh_container{
  display:block;
  margin-left:auto;
  margin-right:auto;
}
.icons{
    display:flex;
    padding: 5px;
}
.outer_container{
    display:flex;
    flex-direction: column;
    align-items: center;
}
.send_container{
    box-sizing:border-box;
    display:flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
    width:70%;
    margin: 0 auto;
}
.balance_left{
    display:flex;
    flex-direction: column;
    align-items:flex-start;
}
.balance_calculator{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: space-between;
    align-items:center;
}
.send_button_container{
    display:flex;
    flex-direction: row;
}
.receive_container{
    border: 1px solid #EDEDED;
    border-radius: 5px;
    box-sizing:border-box;
    padding:15px;
    display:flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
    width:85%;
    margin: 25px auto;
}
.receive_top{
    display:flex;
    flex-direction: row;
}
.receive_bottom{
    display:flex;
    flex-direction: row;
    justify-content:space-between;
    padding-left: 18px;
    padding-right: 18px;
}
.receive_address{
    font-size:1rem;
    line-height: 20px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    text-transform: uppercase;
    color: #777777;
    align-self:center;
}
.copy_text{
    color:#000000;
    font-size:14px;
    line-height: 17px;
}
.download_text{
    color:#000000;
    font-size:14px;
    line-height: 17px;
}
.transaction_container{
  display:flex;
  flex-direction: row;
  border-style: solid; 
  border-width: 0px 0px 1px 0px;
  border-color: #DEDEDE;
  width: 80%;
}
.transaction_container:hover{
    cursor:pointer
}
.transaction_container_left{
  display:flex;
  flex-direction: column;
  align-items:flex-start;
  width:50%;
}
.transaction_container_right{
  display:flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items:center;
  align-content:center;
  width:50%;
}
.settings_container{
  display:flex;
  flex-direction: row;
  border-style: solid; 
  border-width: 0px 0px 1px 0px;
  border-color: #DEDEDE;
  width: 80%;
}
.item_container_left{
  display:flex;
  flex-direction: column;
  align-items:flex-start;
  width:50%;
}
.item_container_right{
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items:center;
  align-content:center;
  width:50%;
}
.menu_container{ 
    display:flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
    align-content:center;
}

.wallet_overview{
    display:flex;
    flex-direction: row;
}
.middle_menu{
    display:flex;
    flex-direction: row;
}
.wallet_tab{
    padding:28px;
    font-weight:600;
}
.send_tab{
    padding:28px;
    font-weight:600;
}
.receive_tab{
    padding:28px;
    font-weight:600;
}
.wallet_tab_selected{
    padding:28px;
    color:#F7931A;
    border-style: solid; 
    border-width: 0px 0px 5px 0px;
    border-color: #F7931A;
    font-weight:600;
}
.receive_tab_selected{
    padding:28px;
    color:#F7931A;
    border-style: solid; 
    border-width: 0px 0px 5px 0px;
    border-color: #F7931A;
    font-weight:600;
}
.send_tab_selected{
    padding:28px;
    color:#F7931A;
    border-style: solid; 
    border-width: 0px 0px 5px 0px;
    border-color: #F7931A;
    font-weight:600;
}
.description_balance{
    padding-left: 20px;
}
.description{
    color: #777777;
    line-height:16px;
}
.balance{
    line-height: 15.73px;
    color:#000000;

}
.receive_balance{
    line-height: 15.73px;
    color: green;

}
.send_balance{
    line-height: 15.73px;
    color: #000000;

}
.loading{
  cursor:wait;
}
html.waiting{
  cursor:wait;
}
.strong_text{
    font-weight:800;
    text-align: center;
}

</style>
