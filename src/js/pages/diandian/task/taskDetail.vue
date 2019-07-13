<template>
  <div>
    <list ref="list" show-scrollbar="false" showRefresh="true" @refresh="onrefresh">
      <cell class="wxc-cell" @click="onClikedHeader">
        <image class="user-avator" :src="data.detail.icon" placeholder="https://pic1.zhimg.com/da8e974dc.jpg"></image>
        <div class="user-name-container">
          <text class="user-name">{{ data.detail.appName }}</text>
          <text class="user-id">{{ data.detail.publisher }}</text>
        </div>
        <text style="font-family: qimaiIconfont; margin-left: 20px; font-size: 32px; color: #ccc;">&#xe621;</text>
      </cell>
      <cell class="cell-temp-line"></cell>
      <cell>
        <wxc-cell label="提交任务："
                  :has-arrow="false"
                  :has-top-border="false"
                  :has-bottom-border="true">
          <div slot="title" style="">
            <input ref="appNumber" class="number input" placeholder="输入注册账号" @input="numberOnInput" type="text" />
            <input ref="appPassword" class="password input" placeholder="输入账号昵称" @input="pwdOnInput" type="text" />
          </div>
        </wxc-cell> 
      </cell>
      <cell class="cell-temp-line"></cell>
      <cell>
        <wxc-cell label="任务编号："
                  :has-arrow="false"
                  :has-top-border="true"
                  :has-bottom-border="true">
          <text slot="title">{{ data.detail.appId }}</text>
        </wxc-cell>
      </cell>
      <cell>
        <wxc-cell label="截止时间："
                  :has-arrow="false"
                  :has-top-border="false"
                  :has-bottom-border="true">
          <text slot="title">{{ endTime }}</text>
        </wxc-cell>
      </cell>
      <cell>
        <wxc-cell label="任务要求："
                  :has-arrow="false"
                  :has-top-border="false"
                  :has-bottom-border="true">
          <text slot="title" style="color: blue;">完成该 APP 的下载和注册</text>
        </wxc-cell>
      </cell>
      <cell>
        <wxc-cell label="获得佣金："
                  :has-arrow="false"
                  :has-top-border="false"
                  :has-bottom-border="true">
          <text slot="title" style="font-weight: bold; color: #FE802B;">{{ reward }} 元</text>
        </wxc-cell>
      </cell>
      <cell style="height: 200px; justify-content: center; align-items: center;">
        <wxc-button text="提交任务"  style="width: 600px; background-color: #FE802B;"
              @wxcButtonClicked="wxcButtonClicked"></wxc-button>
      </cell>
    </list>
  </div>
</template>

<script>
import { WxcCell, WxcButton } from 'weex-ui'
import Nav from '../components/nav'
import Tools from '../tools'

export default {
  components: {Nav, WxcCell, WxcButton},
  data () {
    return {
      data: {},
      endTime: 0,
      number:'',
      password: '',
      role: 0,
      reward: 0,
      isLoading: false
    }
  },
  created () {
    const self  = this
    this.$router.getParams().then(resData => {
      self.data = resData
      self.endTime = Tools.timeFormat(resData.end_time)
    })

    this.account()
  },
  methods: {
    onrefresh () {
      setTimeout(() => {
          this.$refs['list'].refreshEnd()
      }, 1000)
    },

    onClikedHeader () {
      this.$router.toWebView({
        url: this.data.pageUrl,
        title: this.data.detail.appName,
        navShow: true
      })
    },
    wxcButtonClicked () {
      if (this.isLoading) {
        return
      }

      if (this.role == 0) {
        const self = this
        this.$notice.alert({
          title: '请先开通会员',
          message: '开通会员，每日任务不断',
          okTitle: '确认',
          callback() {
            self.$router.open({name: 'member.members'})
          }
        })
        return
      }
      if (this.number == '' || this.password == '') {
        this.$notice.toast({ message: '任务未完成'})
        return
      }

      this.isLoading = true
      this.$notice.loading.show()
      this.$fetch({
        method: 'POST',
        name: 'task.submit',
        header: {
          zc_0: Tools.zc_0()
        },
        data: {
          task_id: this.data._id,
          app_number: this.number,
          app_password: this.password,
          reward: this.reward
        }
      }).then(resData => {
        this.isLoading = false
        this.$notice.loading.hide()
        if (resData.success == '1') {
          this.$notice.toast({ message: '完成任务' })
          this.$event.emit('refreshTask')
          setTimeout(() => {
            this.$router.back({})
          }, 1000)
          return
        }
        this.$notice.toast({ message: '任务提交失败' })  
      }, error => {
        this.isLoading = false
        this.$notice.loading.hide()
        this.$notice.toast({ message: '提交失败' })
      })
    },
    numberOnInput (e) {
      this.number = e.value
    },
    pwdOnInput (e) {
      this.password = e.value
    },
    account () {
      this.$fetch({
        method: 'GET',
        name: 'mine.account',
        header: {
          zc_0: Tools.zc_0()
        }
      }).then(resData => {
        this.$refs['list'].refreshEnd()
        if (resData.success == '1') {
          this.role = resData.data.role
          this.reward = resData.data.reward
        }
      }, error => {
        this.$notice.toast({ message: '数据请求失败' })
      })
    }
  }
}
</script>

<style scoped>
  .user-avator {
    width: 140px;
    height: 140px;
    border-radius: 7px;
  }
  .wxc-cell {
    align-items: center;
    flex-direction: row; 
    background-color: #fff;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 40px;
    padding-bottom: 40px;
  }
  .user-name-container {
    margin-left: 20px;
    width: 480px;
  }
  .user-name {
    font-size: 38px;
    text-overflow: ellipsis;
    lines: 1;
    font-weight: bold;
  }
  .user-id {
    margin-top: 14px;
    text-overflow: ellipsis;
    lines: 1;
    color: #999;
  }
  .cell-temp-line {
    height: 20px;
  }
  .input {
    height: 60px;
    width: 400px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(162, 217, 192);
    border-radius: 8px;
    font-size: 28px;
    padding-left: 20px;
  }
  .password {
    margin-top: 10px;
  }



</style>
