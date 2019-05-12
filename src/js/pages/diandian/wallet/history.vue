<template>
  <list ref="list" :show-scrollbar="false" :showRefresh="true" @refresh="onrefresh">
    <cell v-for="item in lists" :key="item.id" style="background-color: #ffffff;">
      <div class="cell-container">
        <text class="avator" :style="{color: item.type == 0 ? '#ed4040' : '#1296db'}">{{ item.type == 0 ? '&#xe61e;' : '&#xe62f;' }}</text>
        <div style="flex: 2; margin-left: 30px;">
          <text class="title">{{ item.type == 0 ? '完成推广任务' : '提现操作' }}</text>
          <text class="time">{{item.create_time}}</text>
        </div>
        <text class="money" :style="{color: item.type==0 ? '#FE802B': '#999999'}">{{ (item.type == 0 ? '+' : '-') + item.count}}</text>
      </div>
      <div class="line"></div>
    </cell>
  </list>
</template>

<script>
import Tools from '../tools'

export default {
  components: {Tools},
  data: () => ({
    lists: []
  }),
  created () {
    const domModule = weex.requireModule('dom')
    domModule.addRule('fontFace', {
      fontFamily: 'mmRecordIconfont',
      src: `url('http://at.alicdn.com/t/font_1171040_1j0vxzt9eu.ttf')`
    })

    this.query()
  },
  methods: {
    onrefresh () {
      this.query()
    },
    query () {
      this.$fetch({
        method: 'GET',
        name: 'wallet.history',
        header: {
          zc_0: Tools.zc_0()
        }
      }).then(resData => {
        for (var item of resData) {
          item.create_time = Tools.timeFormat(item.create_time)
          console.log(item.count)
        }
        this.lists = resData
        this.$refs['list'].refreshEnd()
      }, error => {
        this.$refs['list'].refreshEnd()
        this.$notice.toast({ message: '数据请求失败' })
      })
    }
  }
}
</script>

<style scoped>
  .cell-container {
    flex-direction: row;
    margin: 40px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .line {
    height: 0.5px;
    background-color: #ccc;
    margin-left: 130px;
  }
  .avator {
    font-family: mmRecordIconfont;
    font-size: 60;
  }
  .time {
    font-size: 26px;
    margin-top: 10px;
    color: #999;
  }
  .money {
    font-size: 36px;
    font-weight: bold;
  }
</style>
