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
        <wxc-cell label="用户 ID"
                  :has-arrow="false"
                  :has-top-border="true"
                  :has-bottom-border="true">
          <text slot="title">{{userID}}</text>
        </wxc-cell>
      </cell>
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
      <cell>
        <wxc-cell label="银行卡"
                  :has-arrow="true"
                  @wxcCellClicked="openCard"
                  :has-top-border="false"
                  :has-bottom-border="true">
          <text slot="title">{{ card.hasOwnProperty('number') ? card.number : '点击设置银行卡号' }}</text>
        </wxc-cell>
      </cell>
      <cell class="cell-temp-line"></cell>
      <cell>
        <wxc-cell label="客服 QQ"
                  :has-arrow="false"
                  :has-top-border="true"
                  :has-bottom-border="true">
          <text slot="title">{{qqNumber}}</text>
        </wxc-cell>
      </cell>
      <cell class="cell-temp-line"></cell>
      <cell>
        <wxc-cell :has-arrow="false"
                  @wxcCellClicked="(e) => {this.$router.open({ name:'mine.switch'})}"
                  :has-top-border="true"
                  :has-bottom-border="true">
          <text slot="title" style="text-align: center;">账号管理</text>
        </wxc-cell>
      </cell>
      <cell style="padding-bottom: 60px;">
        <wxc-cell :has-arrow="false"
                  @wxcCellClicked="logout"
                  :has-top-border="false"
                  :has-bottom-border="true">
          <text slot="title" style="text-align: center;">退出登录</text>
        </wxc-cell>
      </cell>
    </list>
  </div>
</template>

<script>
import { WxcCell, wxcButton } from 'weex-ui'
import Nav from '../components/nav'
import Tools from '../tools'

export default {
  components: {Nav, WxcCell, wxcButton},
  data () {
    return {
      nick: '',
      roleName: '',
      phone: '',
      card: {},
      role: 0,
      reward: 0,
      avator: 'https://pic1.zhimg.com/da8e974dc.jpg',
      userID: '',
      qqNumber: '',
      owner: true
    }
  },
  created () {
    this.onrefresh()
    this.getNumber()
    this.$event.on('refreshAccount', params => {
      this.onrefresh()
    })
  },
  methods: {
    setAvator () {
      const a = this.$storage.getSync('avator')
      if (a.length > 0) {
        this.avator = a
      }
    },
    getNumber () {
      this.$fetch({
        method: 'GET',
        name: 'mine.customer'
      }).then(res => {
        console.log(res)
        if (res.hasOwnProperty('QQ')) {
          this.qqNumber = res.QQ
        }
      })
    },
    onrefresh () {
      this.setAvator()
      this.$fetch({
        method: 'GET',
        name: 'mine.account',
        header: {
          zc_0: Tools.zc_0()
        }
      }).then(resData => {
        this.$refs['list'].refreshEnd()
        if (resData.success == '1') {
          if (resData.data.hasOwnProperty("phone") == false || resData.data.account_status != 0) {
            this.logout()
            return
          } 

          let account = this.$storage.getSync('account')
          if (account.hasOwnProperty('owner')) {
            resData.data['owner'] = account.owner
          }
          this.$storage.set('account', resData.data).then(resData => {
            this.setMineData(resData)
            this.setAvator ()
          })
        }
      }, error => {
        this.$refs['list'].refreshEnd()
        // this.$notice.toast({ message: '数据请求失败' })
      })
    },
    setMineData (data={}) {
      this.setAvator()
      if (data.hasOwnProperty("nick")) {
        this.bindInfo(resData)
        return
      }
      this.$storage.get('account').then(resData => {
        this.bindInfo(resData)
      })
    },

    bindInfo (resData) {
      this.nick = resData.nick
      this.roleName = resData.role_name
      this.phone = resData.phone
      this.role = resData.role
      this.reward = resData.reward
      this.userID = resData.user_id
      if (resData.hasOwnProperty("card")) {
        this.card = resData.card
      } 
      if (resData.hasOwnProperty('owner')) {
        this.owner = resData.owner
      }
      this.$event.emit('updateUserInfo', resData)
    },

    agreementClicked () {
      this.$router.toWebView({
        url: 'https://maimaituiguang.github.io/mm-web/agreement.html',
        title: '协议',
        navShow: true
      })
    },

    logout () {
      this.$storage.delete('account').then(resData => {
        this.$event.emit('reloadEntry')
      })
    },
    openCard() {
      if (this.owner) {
        this.$router.open({name:'mine.card', params: this.card})
        return
      }

      this.$notice.toast({message: "请用超级密码登陆"})
      
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
