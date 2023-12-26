<template>
<div class="page">
    <header>
        <h1>Congratulations. You have successfully set up your wallet.</h1>
        <h2>Please swap over to your primary machine, remove all hardware wallet media and reboot.</h2>
        <h2>This will start your computer in "Node Mode" and allow you to sync the Bitcoin blockchain.</h2>
        <h2>This may take anywhere from a day to several weeks depending on your computer and internet speed.</h2>
        <h2>It is required before you can log in to your wallet.</h2>
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

