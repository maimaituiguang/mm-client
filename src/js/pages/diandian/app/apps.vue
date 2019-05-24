<template>
  <div>
    <Nav bgColor="#fff" navTitle="应用" leftText=" " />
    <list ref="list" 
          show-scrollbar="true" 
          showRefresh="true" 
          @refresh="onrefresh" 
          showLoadMore="true" 
          @loadMore="loadMore" 
          loadmoreoffset=3 >
      <cell style="background-color: #fff; height: 20px;"></cell>
      <cell class="app-cell" v-for="item in lists" :key="item" @click="() => { open(item) }">
        <image class="app-avator" :src="item.icon" placeholder="https://pic1.zhimg.com/da8e974dc.jpg"></image>
        <div class="app-name-container">
          <text class="app-name">{{item.appName}}</text>
          <text class="app-id">{{item.publisher}}</text>
        </div>
      </cell>
    </list>
  </div>
</template>

<script>

import Nav from '../components/nav'
import { WxcCell } from 'weex-ui'
import { host } from '../../../config/base'

export default {
  components: {Nav, WxcCell},
  data: () => ({ 
    lists: []
  }),
  created () {
    this.query(0).then(data => { 
      this.lists = data
      this.$refs['list'].refreshEnd()
    })
  },
  methods: {
    onrefresh () {
      this.query(0).then(data => { 
        this.lists = data
        this.$refs['list'].refreshEnd()
      })
    },
    loadMore () {
      this.query(this.lists.length).then(data => { 
        this.lists.push(...data)
        this.$refs['list'].loadMoreEnd()
      })
    },
    async query (offset) {
      var list = []
      await this.$fetch({
          method: 'GET',
          url: host + '/apps/' + offset
      }).then(resData => {
          list = resData
      }, error => {
          this.$refs['list'].refreshEnd()
          this.$refs['list'].loadMoreEnd()
      })
      return list
    },
    open (item) {
      // iOS 'https://www.qimai.cn/app/baseinfo/appid/'+item.appId+'/country/cn'
      this.$router.toWebView({
        url: 'https://www.qimai.cn/andapp/baseinfo/appid/'+item.appId,
        title: item.appName,
        navShow: true
      })
    }
  }
}

</script>

<style scoped>
.app-avator {
    width: 140px;
    height: 140px;
    border-radius: 10px;
  }
  .app-cell {
    align-items: center;
    flex-direction: row; 
    background-color: #fff;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 20px;
    padding-bottom: 20px;
    margin-bottom: 0.5px;
  }
  .app-name-container {
    margin-left: 20px;
    margin-right: 20px;
    width: 510px;
  }
  .app-name {
    font-size: 34px;
    text-overflow: ellipsis;
    lines: 1;
  }
  .app-id {
    font-size: 30px;
    margin-top: 14px;
    color: #999;
    lines: 1;
    text-overflow: ellipsis;
  }
  .cell-line {
    height: 0.5px;
    background-color: #ccc;
    margin-left: 200px;
  }
</style>
