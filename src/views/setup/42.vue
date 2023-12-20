<template>
<div class="page">
    <header>
        <h1>Hardware Wallet 6</h1>
        <h2>Please power off this machine, insert Hardware Wallet 6 and power on the machine.</h2>
        <h2>You may close this window.</h2>
    </header> 

</div>
<ProgressBar/>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'

export default {
  name: 'Setup42',
  components: {
    ProgressBar
  },
    }
</script>

