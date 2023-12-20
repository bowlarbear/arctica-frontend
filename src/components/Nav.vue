<template>
    <div class="nav_container"> 
        <div class="icon_container">
            <router-link v-if="dash" class="icons" :to="{ name: 'dashboard' }"><img src="@/assets/wallets_selected.png"></router-link>
            <router-link v-else class="icons" :to="{ name: 'dashboard' }"><img src="@/assets/wallets.png"></router-link>  
            <router-link v-if="settings" class="icons" :to="{ name: 'settings' }"><img src="@/assets/settings_selected.png"></router-link>
            <router-link v-else class="icons" :to="{ name: 'settings' }"><img src="@/assets/settings.png"></router-link>
        </div>
    </div>
</template>


<script>
import { RouterView, RouterLink } from "vue-router";
{
  RouterView;
  RouterLink
}

export default{
    name: 'Nav',
    methods: {},
    computed: {
        dash(){
            if(this.$route.path =='/wallets'){
                return true
            } else {
                return false
            }
        },
        settings(){
            if(this.$route.path=='/settings'){
                return true
            } else{
                return false
            }
        }, 
    },
    }
</script>

<style scoped>
.icon_container{
    padding-top:40px;
}
</style>