<template>
  <wxc-tab-bar :tab-titles="tabTitles"
               :tab-styles="tabStyles"
               :duration="duration"
               title-type="iconFont"
               @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected">
    <Task class="page-container" v-if="showTab" :style="contentStyle" />
    <Apps class="page-container" v-if="showTab" :style="contentStyle" />
    <Wallet class="page-container" v-if="showTab" :style="contentStyle" />
    <Mine class="page-container" v-if="showTab" :style="contentStyle" />
  </wxc-tab-bar>
</template>

<style scoped>
</style>
<script>
import {WxcTabBar, Utils} from 'weex-ui'
import Config from './config'
import Task from '../task/task'
import Apps from '../app/apps'
import Wallet from '../wallet/wallet'
import Mine from '../mine/mine'

export default {
  components: {WxcTabBar, Task, Apps, Wallet, Mine},
  data: () => ({
    tabTitles: Config.tabIconFontTitles,
    tabStyles: Config.tabIconFontStyles,
    duration: 0,
    showTab: false
  }),
  created () {
    const tabPageHeight = Utils.env.getScreenHeight()
    const iphoneX = Utils.env.isIPhoneX()
    const { tabStyles } = this
    this.contentStyle = { height: (tabPageHeight - tabStyles.height - (iphoneX ? 80 : 0)) + 'px', width: 750 + 'px' }

    const domModule = weex.requireModule('dom')
    domModule.addRule('fontFace', {
      fontFamily: 'qimaiIconfont',
      src: `url('http://at.alicdn.com/t/font_1141272_cz4hclau60o.ttf')`
    })

    if (this.$storage.getSync('account') == '') {
      this.$event.on('registerSuccess', params => {
        this.showTab = true
      })
      this.$router.open({ name:'account.register', type:'PRESENT' })
    } else {
      this.showTab = true
    }
  },
  methods: {
    wxcTabBarCurrentTabSelected (e) {}
  }
}
</script>

<style scoped>
</style>
