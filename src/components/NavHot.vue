<template>
    <div class="nav_container"> 
        <div class="menu_container">
            <div class="wallet_overview">
                    <img src="@/assets/Wallet.png"/>
                    <div class="description_balance">
                    <h2 class="description">Hot Wallet</h2>
                    <h2 class="balance">₿ {{ hotBalance }}</h2>
                    </div>
            </div>

            <div class="middle_menu">
                <h2 v-if="wallet" class="wallet_tab_selected">Wallet</h2> 
                <router-link v-else :to="{ name: 'hot' }">
                    <h2 class="wallet_tab">Wallet</h2> 
                </router-link>
                <h2 v-if="send" class="send_tab_selected">Send</h2> 
                <router-link v-else :to="{ name: 'hotSend' }">
                    <h2 class="send_tab">Send</h2>
                </router-link> 
                <h2 v-if="receive" class="receive_tab_selected">Receive</h2> 
                <router-link v-else :to="{ name: 'hotReceive' }">
                    <h2 class="receive_tab">Receive</h2> 
                </router-link>
            </div>

            <div class="icon_container">
                <router-link class="icons" :to="{ name: 'dashboard' }"><img src="@/assets/wallets.png"></router-link> 
                <router-link class="icons" :to="{ name: 'settings' }"><img src="@/assets/settings.png"></router-link>
            </div>
        </div>
    </div>
</template>



<script>
import { RouterView, RouterLink } from "vue-router";
import store from '../store.js'
{
  RouterView;
  RouterLink
}

export default{
    name: 'NavHot',
    props: {},
    computed: {
        wallet(){
            if(this.$route.path =='/wallets/hot'){
                return true
            } else {
                return false
            }
        },
        send(){
            if(this.$route.path=='/wallets/hot/send'){
                return true
            } else{
                return false
            }
        },
        receive(){
            if(this.$route.path=='/wallets/hot/receive'){
                return true
            } else{
                return false
            }
        }
    },
     mounted(){
    this.hotBalance = store.getters.getHotBalance
 },
    data(){
        return{
            hotBalance: null
        }
    }
}
</script>

<style scoped>
img{
    align-self: center;
}
</style>