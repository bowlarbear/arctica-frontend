<!-- This page is not currently in the setup flow. Waiting for BPS to be ready 
before implementing this page as an asset -->



<template>
<Setup2a v-if="passwordSetup" v-on:goBack="goBack" :password="password2"/>


  <header v-else>
<h1>Let's set up your password</h1>
 <h2>Select two words which are easy for you to remember, such as an adjective and a noun.</h2> 
 <h2>You should not write these words down.</h2> 
     <h2>Below is an example which you can use if you like</h2>
     <h4>{{  firstWord  }} {{  secondWord  }}</h4> 

            <div class="form_container">
                <form>
                    <label>Enter Password</label>
                   <br><input v-model="password1" type="password" required placeholder="Your secret password">

                    <br><label>Confirm Password</label>
                   <br><input v-model="password2" type="password" required placeholder="Your secret password">
                </form>
                <div class="btn_container"> 
                    <button v-if="password1 == password2 && password1 != '' && password2 != '' " @click="acknowledge()" class="btn">Continue</Button>
                    <button v-else @click="warn()" class="btn3">Continue</Button>
                    <button @click="selectWords()" class="btn2">Get New Words</button>
                </div>
                </div>
    
</header>
<ProgressBar/>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'
import Setup2a from './2a'
import wordlist from '../../wordlist.js'

export default {
  name: 'Setup2',
  components: {
      Setup2a,
      ProgressBar
    },
    methods: {
        acknowledge(){
            this.passwordSetup = true
        },
        warn(){
        },
        goBack(){
            this.passwordSetup = false
            this.password1 = ''
            this.password2 = ''
        },
        selectWords(){
            this.firstWord = wordlist[Math.random()*2048 | 0]
            this.secondWord = wordlist[Math.random()*2048 | 0]
        }
    },
     data(){
     return{
         password1: '',
         password2: '',
         passwordSetup: false,
         firstWord: wordlist[Math.random()*2048 | 0],
         secondWord: wordlist[Math.random()*2048 | 0],
     }
 }
}
</script>

<style scoped>
h4{
    color:black;
    text-align:center;
    font-family: 'SF Pro Display';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 140%;
}
</style>

