<template>
  <wxc-tab-bar :tab-titles="tabTitles"
               :tab-styles="tabStyles"
               :duration="duration"
               title-type="iconFont"
               @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected">
    <Task class="page-container" :style="contentStyle" />
    <Apps class="page-container" :style="contentStyle" />
    <Wallet class="page-container" :style="contentStyle" />
    <Mine class="page-container" :style="contentStyle" />
  </wxc-tab-bar>
</template>

<script>
import {WxcTabBar, Utils, WxcButton} from 'weex-ui'
import Config from './config'
import Task from '../task/task'
import Apps from '../app/apps'
import Wallet from '../wallet/wallet'
import Mine from '../mine/mine'

export default {
  components: {WxcTabBar, Task, Apps, Wallet, Mine, WxcButton},
  data: () => ({
    tabTitles: Config.tabIconFontTitles,
    tabStyles: Config.tabIconFontStyles,
    duration: 0
  }),
  created () {
    const tabPageHeight = Utils.env.getScreenHeight()
    const iphoneX = Utils.env.isIPhoneX()
    const { tabStyles } = this
    this.contentStyle = { height: (tabPageHeight - tabStyles.height - (iphoneX ? 80 : 0)) + 'px', width: '750px' }

    const domModule = weex.requireModule('dom')
    domModule.addRule('fontFace', {
      fontFamily: 'qimaiIconfont',
      src: `url('http://at.alicdn.com/t/font_1141272_cz4hclau60o.ttf')`
    })

    this.$event.on('logout', params => {
      this.$router.back({})
    })
  },
  methods: {}
}
</script>