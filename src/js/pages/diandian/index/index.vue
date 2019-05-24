<template>
  <div></div>
</template>

<script>
  export default {
    created () {
      this.$router.open({
        name: 'index.entry',
        type: 'PUSH',
        showNav: false,
        canBack: false
      })
    }
  }
</script>