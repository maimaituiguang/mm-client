<template>
<div>
  <div ref="card-container" class="container" :style="containerStyle">
    <Login @switchToCard="cardSwitch" />
    <Register @switchToCard="cardSwitch" />
    <SMSLogin @switchToCard="cardSwitch" />
  </div>
</div>
</template>
<script>
  import { WxcCell, wxcButton, Utils } from 'weex-ui'
  import Login from './login'
  import Register from './register'
  import SMSLogin from './smsLogin'

  const animation = weex.requireModule('animation')
  const sms = weex.requireModule('smsCode')

  export default {
    components: {Login, Register, SMSLogin},
    data () {
      return {
        containerStyle: {}
      }
    },
    eros: {
      beforeDisappear (options) {
        if (Utils.env.isAndroid()) {
          sms.unregisterEventHandler()
        }
        
        this.$notice.loading.hide()
      }
    },
    created () {
      const pageHeight = Utils.env.getPageHeight()
      this.containerStyle = {width: `${750*3}px`, height: pageHeight + 'px', backgroundColor:'#ffffff'}

      if (Utils.env.isAndroid()) {
        sms.initSMS()
      }
    },
    methods: {
      cardSwitch(page) {
        const dist = page * 750
        animation.transition(this.$refs[`card-container`], {
          styles: {
            transform: `translateX(${-dist}px)`
          },
          duration: 0.00001,
          timingFunction: 'ease',
          needLayout: false,
          delay: 0
        })
      }
    }
  }
</script>

<style scoped>
  .container {
    flex-direction: row;
    background-color: #ffffff;
    padding-top: 88px;
  }
</style>