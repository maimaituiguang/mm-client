<template>
  <wxc-tab-page ref="wxc-tab-page"
                :tab-titles="tabTitles"
                :tab-styles="tabStyles"
                title-type="text"
                :tab-page-height="tabPageHeight"
                @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
    <ViewList class="item-container" status=0 :listHeight="viewListHeight" />
    <ViewList class="item-container" status=1 :listHeight="viewListHeight" />
    <ViewList class="item-container" status=2 :listHeight="viewListHeight" />
  </wxc-tab-page>
</template>

<style scoped>
  .item-container {
    width: 750px;
    background-color: #f2f3f4;
  }
</style>

<script>
  import { WxcTabPage, Utils } from 'weex-ui'
  import Config from './config'
  import ViewList from './viewList'

  export default {
    components: { WxcTabPage, ViewList },
    data: () => ({
      tabTitles: Config.tabTitles,
      tabStyles: Config.tabStyles,
    }),
    created () {
      this.tabPageHeight = Utils.env.getPageHeight()
      this.viewListHeight = Utils.env.getPageHeight() - 120
    },
    methods: {
      wxcTabPageCurrentTabSelected (e) {
        
      }
    }
  };
</script>