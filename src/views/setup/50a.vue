<!-- Consider revising this to having the user boot to primary machine with no Hardware Wallet inserted and have them complete IBD there -->

<template>
<div class="page">
    <header>
        <h1>Hardware Wallet 1</h1>
        <h2>Please swap over to your primary machine, power it off, insert Hardware Wallet 1 and power on the machine.</h2>
        <h2>You may close this window.</h2>
    </header> 
</div>
<ProgressBar/>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'

export default {
  name: 'Setup50a',
  components: {
    ProgressBar
  },
    }
</script>

