<template>
  <div>
    <div :style="{height: navTempHeight + 'px'}"></div>
    <list ref="list" :show-scrollbar="false" :showRefresh="true" @refresh="onrefresh">
      <cell>
        <Banner />
        <div class="task-container">
          <div style="flex-direction: row; align-items: center;">
            <text class="gonggao">&#xe7a4; </text>
            <text style="color: red; flex:2; margin-left: 20px;">升级会员，佣金翻倍</text>
          </div>
          <Card style="margin-top: 40px;" />
          <div class="task-title-container">
            <div class="task-title-left">
              <text class="task-title">今日任务</text>
              <div class="task-title-line"></div>
            </div>
            <text class="task-title-right" @click="tapedAllTaskItem">全部任务 &#xe621;</text>
          </div>
        </div>
      </cell>
      <cell v-for="(item, index) in lists" :key="item._id" :index="index" @click="(e) => { handleClickedCell(e, item) }">
        <TaskCell :item="item" style="margin-left: 40px; margin-right: 40px;" />
      </cell>
      <cell v-if="lists.length == 0" style="align-items: center; padding-top: 80px;">
        <text>任务已做完或还未下发任务</text>
      </cell>
    </list>
  </div>
</template>

<script>
import Banner from '../components/banner'
import TaskCell from '../components/taskCell'
import Card from './card'
import Nav from '../components/nav'
import { WxcCell, Utils } from 'weex-ui'
import Tools from '../tools'

export default {
  components: {Banner, Card, TaskCell, Nav, WxcCell},
  data () {
    return {
      navTempHeight: (Utils.env.isIPhoneX() ? 88 : 0),
      lists: [],
      account: {}
    }
  },
  created () {
    this.onrefresh()
  },
  methods: {
    onrefresh () {
      this.queryTask()
      this.account = this.$storage.getSync('account')
    },
    tapedAllTaskItem () {
      this.$router.open({ name: 'task.list' })
    },
    handleClickedCell (e, item) {
      this.$router.open({ name: 'task.detail', params: item})
    },
    queryTask () {
      this.$fetch({
        method: 'GET',
        name: 'task.doing',
        header: {
          zc_0: Tools.zc_0()
        }
      }).then(resData => {
        for (var item of resData) {
          item.reward = this.account.reward
        }
        this.lists = resData
        this.$refs['list'].refreshEnd()
      }, error => {
        this.$refs['list'].refreshEnd()
        // this.$notice.toast({ message: '数据请求失败' })
      })
    }
  }
}
</script>

<style scoped>
  .task-container {
    margin: 40px;
    margin-bottom: 20px;
    align-items: stretch;
  }
  .gonggao {
    font-family: qimaiIconfont;
    font-size: 50px;
    color: #ed4040;
  }
  .task-title-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
  }
  .task-title {
    color: #333333;
    font-weight: bold;
    font-size: 36px;
  }
  .task-title-line {
    height: 8px;
    width: 140px;
    background-color: #FE802B;
    margin-top: 16px;
  }
  .task-title-right {
    font-size: 26px;
    font-family: qimaiIconfont;
    color: #999;
  }
</style>
