<template>
<div>
<div class="container" :style="containerStyle">
  <Login v-if="cardType == 1" />
  <Register v-if="cardType == 2" />
  <SMSLogin v-if="cardType == 3" />
  <div class="switch-scope" @click="cardSwitch(cardType)">
    <text style="font-size: 30px; color: #4BB93B; padding: 40px; margin-left: 20px;">{{title}}</text>
    <text v-if="cardType == 1"
          style="font-size: 26px; padding: 40px; color: #444; margin-right: 20px;"
          @click="cardSwitch(0)">忘记密码？</text>
  </div>
</div>
</div>
</template>
<script>
  import { WxcCell, wxcButton, Utils } from 'weex-ui'
  import Login from './login'
  import Register from './register'
  import SMSLogin from './smsLogin'

  const sms = weex.requireModule('smsCode')

  export default {
    components: {Login, Register, SMSLogin},
    data () {
      return {
        containerStyle: {},
        cardType: 1,
        title: '切换到注册'

      }
    },
    created () {
      const pageHeight = Utils.env.getPageHeight()
      this.containerStyle = {width: '750px', height: pageHeight + 'px', backgroundColor:'#ffffff'}

      this.$navigator.setNavigationInfo({ navShow: true })
      this.$navigator.setLeftItem({
        image: 'https://maimaituiguang.github.io/mm-web/images/empty.jpg'
      })

      
    },
    methods: {
      cardSwitch(type) {
        switch (type) {
          case 0: {
            this.cardType = 3
            this.title = "密码登录"
          } break
          case 1: {
            this.cardType = 2
            this.title = "密码登录"
          } break
          case 2:
          case 3: {
            this.cardType = 1
            this.title = "切换到注册"
          } break
        }
      }
    }
  }
</script>

<style scoped>
  .container {
    align-items: center;
    background-color: #ffffff;
  }
  .switch-scope {
    align-items: center;
    width: 750px;
    flex-direction: row;
    justify-content: space-between;
  }
</style>