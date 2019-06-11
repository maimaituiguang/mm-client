<template>
<div>
  <wxc-tab-bar v-if="!showLogin" :tab-titles="tabTitles"
               :tab-styles="tabStyles"
               :duration="duration"
               title-type="iconFont"
               @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected">
    <Task class="page-container" :style="contentStyle" />
    <Apps class="page-container" :style="contentStyle" />
    <Wallet class="page-container" :style="contentStyle" />
    <Mine class="page-container" :style="contentStyle" />
  </wxc-tab-bar>
  <Login v-if="showLogin" class="login" :style="loginStyle" />
</div>
</template>

<style scoped>
</style>
<script>
import {WxcTabBar, Utils, WxcButton} from 'weex-ui'
import Config from './config'
import Task from '../task/task'
import Apps from '../app/apps'
import Wallet from '../wallet/wallet'
import Mine from '../mine/mine'
import Login from '../account/account'

export default {
  components: {WxcTabBar, Task, Apps, Wallet, Mine, WxcButton, Login},
  data: () => ({
    tabTitles: Config.tabIconFontTitles,
    tabStyles: Config.tabIconFontStyles,
    duration: 0,
    showLogin: false
  }),
  created () {
    const tabPageHeight = Utils.env.getScreenHeight()
    const iphoneX = Utils.env.isIPhoneX()
    const { tabStyles } = this
    this.contentStyle = { height: (tabPageHeight - tabStyles.height - (iphoneX ? 80 : 0)) + 'px', width: 750 + 'px' }
    this.loginStyle = {height: tabPageHeight+'px', widht: '750px'}

    const domModule = weex.requireModule('dom')
    domModule.addRule('fontFace', {
      fontFamily: 'qimaiIconfont',
      src: `url('http://at.alicdn.com/t/font_1141272_cz4hclau60o.ttf')`
    })

    this.$event.on('reloadEntry', params => {
      this.$router.refresh()
    })

    if (!this.isLogin()) {
      this.showLogin = true
    } else {
      this.showLogin = false
    }
  },
  methods: {
    isLogin () {
      return (this.$storage.getSync('account') != '')
    }
  }
}
</script>

<style scoped>
  .login {
    position: absolute;
    background-color: #fff;
  }
</style>
