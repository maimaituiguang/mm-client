<template>
  <div :style="{backgroundColor: bgColor, width: 750 + 'px'}">
    <div class="status" :style="statusStyle"></div>
    <wxc-minibar :background-color="bgColor"
                 :right-text="rightText"
                 :left-text="leftText"
                 @wxcMinibarLeftButtonClicked="leftClicked"
                 @wxcMinibarRightButtonClicked="rightClicked">
      <image v-if="leftText == ''" :src="leftButton" slot="left" style="height: 36px; width: 21px;"></image>
      <text style="font-size: 36px; font-weight: bold;" slot="middle">{{navTitle}}</text>
      <image v-if="rightText == ''" :src="rightButton" slot="right" style="height: 36px; width: 21px;"></image>
    </wxc-minibar>
  </div>
</template>

<script>

import {Utils, WxcMinibar} from 'weex-ui'

export default {
  components: {WxcMinibar},
  props: {
    navTitle: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: ''
    },
    leftText: {
      type: 'String',
      default: ''
    },
    bgColor: {
      type: String,
      default: '#f2f3f4'
    },
    leftButton: {
      type: String,
      default: 'https://gw.alicdn.com/tfs/TB1x18VpwMPMeJjy1XdXXasrXXa-21-36.png'
    },
    rightButton: {
      type: String
    }
  },
  data: () => ({
    statusStyle: {height: 40 + 'px'}
  }),
  created () {
    const isIPhoneX = Utils.env.isIPhoneX()
    if (isIPhoneX) {
      this.statusStyle = { height: 80 + 'px' }
    }
  },
  methods: {
    leftClicked () {
      const Navigator = weex.requireModule('navigator')
      Navigator.pop({}, e => {})
      this.$emit('navLeftClicked', {})
    },
    rightClicked () {
      if (this.rightButton || this.rightText != '') {
        this.$emit('navRightClicked', {})  
      }
      
    }
  }
}

</script>

<style scoped>
</style>
