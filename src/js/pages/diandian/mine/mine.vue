<template>
  <div>
    <Nav leftText=" " navTitle="我的" rightText="" bgColor="#fff" />
    <list ref="list" :show-scrollbar="false" :showRefresh="true" @refresh="onrefresh">
      <cell>
        <wxc-cell :has-arrow="true"
                  @wxcCellClicked="(e) => {this.$router.open({name:'mine.settings', params:{nick: this.nick, alipay: this.alipay}})}"
                  :has-top-border="false"
                  :has-bottom-border="true">
          <div slot="label" class="wxc-cell">
            <image class="user-avator" :src="avator"></image>
            <div class="user-name-container">
              <text class="user-name">{{nick}}</text>
              <text class="user-id" :style="{color:(role != 0?'#FE802B':'#999')}">{{roleName}}</text>
            </div>  
          </div>
        </wxc-cell>
        
      </cell>
      <cell class="cell-temp-line"></cell>
      <cell>
        <wxc-cell label="收益明细"
                  :has-arrow="true"
                  @wxcCellClicked="(e) => {this.$router.open({ name:'wallet.history' })}"
                  :has-top-border="false"
                  :has-bottom-border="true">
        </wxc-cell>
      </cell>
      <cell>
        <wxc-cell label="任务查看"
                  :has-arrow="true"
                  @wxcCellClicked="(e) => {this.$router.open({ name:'mine.viewTask' })}"
                  :has-top-border="false"
                  :has-bottom-border="true">
        </wxc-cell>
      </cell>
      <cell>
        <wxc-cell label="用户协议"
                  :has-arrow="true"
                  @wxcCellClicked="agreementClicked"
                  :has-top-border="false"
                  :has-bottom-border="true">
        </wxc-cell>
      </cell>
      <cell class="cell-temp-line"></cell>
      <cell>
        <wxc-cell label="升级会员"
                  :has-arrow="true"
                  @wxcCellClicked="(e) => {this.$router.open({ name:'member.members'})}"
                  :has-top-border="true"
                  :has-bottom-border="true">
        </wxc-cell>
      </cell>
      <cell class="cell-temp-line"></cell>
      <cell>
        <wxc-cell label="手机号码"
                  :has-arrow="false"
                  :has-top-border="true"
                  :has-bottom-border="false">
          <text slot="title">{{phone}}</text>
        </wxc-cell>
      </cell>
      <cell>
        <wxc-cell label="支付宝账号"
                  :has-arrow="false"
                  @wxcCellClicked="accountListClicked"
                  :has-top-border="true"
                  :has-bottom-border="true">
          <text slot="title">{{ alipay != '' ? alipay : '点击添加支付宝账号' }}</text>
        </wxc-cell>
      </cell>
      <cell class="cell-temp-line"></cell>
      <cell>
        <wxc-cell label="客服 QQ"
                  :has-arrow="false"
                  :has-top-border="true"
                  :has-bottom-border="true">
          <text slot="title">2582985333</text>
        </wxc-cell>
      </cell>
    </list>
  </div>
</template>

<script>
import { WxcCell } from 'weex-ui'
import Nav from '../components/nav'
import Tools from '../tools'

export default {
  components: {Nav, WxcCell},
  data () {
    return {
      nick: '',
      roleName: '',
      phone: '',
      alipay: '',
      role: 0,
      reward: 0,
      avator: 'https://pic1.zhimg.com/da8e974dc.jpg'
    }
  },
  created () {
    this.setMineData()
    this.setAvator()
    this.$event.on('refreshAccount', params => {
      this.onrefresh()
      this.setAvator()
    })
  },
  methods: {
    onrefresh () {
      this.$fetch({
        method: 'GET',
        name: 'mine.account',
        header: {
          zc_0: Tools.zc_0()
        }
      }).then(resData => {
        this.$refs['list'].refreshEnd()
        if (resData.success == '1') {
          this.$storage.set('account', resData.data).then(resData => {
            this.setMineData()
            this.setAvator ()
          })
        }
      }, error => {
        this.$refs['list'].refreshEnd()
        this.$notice.toast({ message: '数据请求失败' })
      })
    },
    setAvator () {
      this.$storage.get('avator').then(resData => {
        this.avator = resData
      })
    },
    setMineData () {
      // this.$storage.delete('account').then(resData => {
      //   console.log("删除成功") 
      // })
      this.$storage.get('account').then(resData => {
        this.nick = resData.nick
        this.roleName = resData.role_name
        this.phone = resData.phone
        this.alipay = resData.alipay
        this.role = resData.role
        this.reward = resData.reward
      })
    },

    agreementClicked () {
      this.$router.toWebView({
        url: 'https://maimaituiguang.github.io/mm-web/agreement.html',
        title: '协议',
        navShow: true
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
    background-color: #ccc;
  }
  .wxc-cell {
    align-items: center;
    flex-direction: row; 
    background-color: #fff;
    padding-right: 40px;
    padding-top: 20px;
    padding-bottom: 40px;
  }
  .user-name-container {
    margin-left: 20px;
  }
  .user-name {
    font-size: 38px;
    font-weight: bold;
  }
  .user-id {
    margin-top: 14px;
    color: #999;
    lines: 1;
  }
  .cell-temp-line {
    height: 20px;
  }


</style>
