<template>
  <div>
    <Nav leftText=" " rightText='收益明细' navTitle="" @navRightClicked="rewardHistory" />
    <list ref="list" :show-scrollbar="false" :showRefresh="true" @refresh="onrefresh">
        <cell> 
          <div class="wallet-container">
            <div style="align-items: center;">
              <image class="user-avator" :src="avator"></image>
              <text class="user-name">{{userName}}</text>
              <text class="user-name">ID: {{userID}}</text>
            </div>
            <div class="wallet-detail">
              <text class="user-money">账户余额</text>
              <text class="user-money-count">{{unTake}}</text>
              <div class="money-container">
                <div class="money-left">
                  <text class="money-left-title">可提现</text>
                  <text style="font-size:20px;color:#666;">(超 20 元可提现)</text>
                  <text class="money-left-number">{{canTake}}</text>
                </div>
                <text class="money-line">.</text>
                <div class="money-right">
                  <text class="money-right-title">累计收益</text>
                  <text class="money-right-number">{{totals}}</text>
                </div>
              </div>
              <div class="reward-button" @click="() => { this.$router.open({ name: 'wallet.reward', type: 'PRESENT', params: {unTake: this.canTake} }) }">
                <text class="reward-button-text">提现</text>
              </div>
            </div>
          </div>
          <div class="user-guide" @click="(e)=>{this.$router.open({name: 'member.members'})}">
            <text class="user-guide-text-left">完任务，赚佣金</text>
            <text class="user-guide-text-right">开通会员 &#xe621;</text>
          </div>
        </cell>
    </list>
  </div>
</template>

<script>
import Nav from '../components/nav'
import Tools from '../tools'

export default {
  components: {Nav},
  data: () => ({
    unTake: '0.00',
    hasTake: '0.00',
    totals: '0.00',
    canTake: '0.00',
    userName: '注册用户',
    avator: 'https://pic1.zhimg.com/da8e974dc.jpg',
    userID: ''
  }),
  created () {
    this.queryTask()
    this.$event.on('updateWallet', params => {
      this.queryTask()
    })
    this.$event.on('updateUserInfo', params => {
      this.setUserInfo(params)
    })
    this.userID = Tools.userID()
  },
  methods: {
    onrefresh () {
      this.queryTask()
    },
    rewardHistory () {
      this.$router.open({ name:'wallet.history' })
    },
    queryTask () {
      this.setUserInfo()
      this.$fetch({
          method: 'GET',
          name: 'wallet.money',
          header: {
            zc_0: Tools.zc_0()
          }
      }).then(resData => {
        if (resData.success == '1') {
          var data = resData.data
          this.unTake = Tools.toDecimal2(data.un_take)
          this.hasTake = Tools.toDecimal2(data.has_take)
          this.totals = Tools.toDecimal2(data.un_take + data.has_take)
          this.canTake = this.unTake - 20 > 0 ? this.canTake : '0.00'
        }
        this.$refs['list'].refreshEnd()
      }, error => {
          this.$refs['list'].refreshEnd()
      })
    },
    setUserInfo (user={}) {
      this.$storage.get('avator').then(resData => {
        this.avator = resData
      })
      if (user.hasOwnProperty("nick")) {
        this.userName = user.nick
        return
      }
      this.$storage.get('account').then(resData => {
        this.userName = resData.nick
      })
    }
  }
}
</script>

<style scoped>
  .user-avator {
    width: 160px;
    height: 160px;
    border-radius: 80px;
    background-color: #ccc;
  }
  .user-name {
    margin-top: 20px;
  }
  .wallet-detail {
    align-items: center;
    margin-top: 50px;
    margin-left: 40px;
    margin-right: 40px;
    background-color: #fff;
    border-radius: 6px;
    padding-top: 70px;
    padding-bottom: 30px;
  }
  .user-money {
    font-size: 28px;
  }
  .user-money-count {
    font-size: 70px;
    font-weight: bold;
    margin-top: 20px;
  }
  .money-container {
    margin-top: 60px;
    margin-bottom: 60px;
    flex-direction: row;
  }
  .money-left, .money-right {
    align-items: center;
  }
  .money-left-title, .money-right-title {
    font-size: 22px;
    color: #888;
  }
  .money-left-number, .money-right-number {
    font-size: 28px;
    color: #888;
    margin-top: 10px;
    font-weight: bold;
  }
  .money-line {
    width: 0.5px;
    background-color: #888;
    margin-left: 100px;
    margin-right: 100px;
    margin-top: 14px;
    margin-bottom: 14px;
  }
  .reward-button {
    height: 70px;
    width: 360px;
    background-color: #FE802B;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    margin-top: 10px;
  }
  .reward-button-text {
    color: #fff;
    font-size: 30px;
  }
  .user-guide {
    background-color: #fff;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    border-radius: 10px;
    margin-left: 40px;
    margin-right: 40px;
    margin-top: 10px;
    padding-left: 30px;
    padding-right: 30px;
  }
  .user-guide-text-left {
    font-size: 28px;
  }
  .user-guide-text-right {
    font-size: 24px;
    color: #888;
    font-family: qimaiIconfont;
  }

</style>
