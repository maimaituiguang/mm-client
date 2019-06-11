<template>
<div class="login-page">
  <text style="font-size: 45px;">密码登录</text>
  <div class="xieyi">
    <text style="color: #999; font-size: 22px;">登录即表示同意 </text>
    <text style="color: #4BB93B; font-size: 22px;" @click="agreementClicked">麦麦推广协议</text>
  </div>
  <div style="align-items: flex-end; width: 750px;">
    <wxc-cell class="cell" :has-bottom-border="true">
      <text class="cell-label" slot="label">手机号</text>
      <input class="cell-title" max-length=11 slot="title" placeholder="请填写手机号码" type="number" @input="(e)=>{this.phone = e.value}" />
    </wxc-cell>
    <wxc-cell class="cell" :has-bottom-border="true">
      <text class="cell-label" slot="label">密码</text>
      <input class="cell-title" slot="title" type="password" placeholder="请输入密码" @input="(e)=>{this.code = e.value}" />
    </wxc-cell>
  </div>
  <wxc-button :btnStyle="btnStyle" 
              text="登录" 
              :disabled="!(this.phone != '' && this.code.length >= 6)" 
              @wxcButtonClicked="submit">
              </wxc-button>
  <div class="switch-scope">
    <text class="left-btn" @click="cardSwitch(1)">切换到注册</text>
    <text class="right-btn" @click="cardSwitch(2)">忘记密码？</text>
  </div>
</div>
</template>
<script>
  import { WxcCell, wxcButton, Utils } from 'weex-ui'

  export default {
    components: {WxcCell, wxcButton},
    data () {
      return {
        btnStyle: {
          backgroundColor:'#4BB93B',
          width: 630+'px', 
          height: 80+'px',
          fontSize: 32+'px',
          marginTop: 40+'px'
        },
        phone: '',
        code: ''
      }
    },
    created () {},
    methods: {
      submit () {
        if (this.phone == '' || this.code < 6) {
          return
        }

        this.$notice.loading.show()
        const self = this
        self.$fetch({
          method: 'POST',
          name: 'account.login',
          data: {
            phone: this.phone,
            password: this.code
          }
        }).then(resData => {
          self.$notice.loading.hide()
          if (resData.success == '1') {
            self.$notice.toast({ message: '登录成功' })
            setTimeout(() => {
              self.$storage.set('account', resData.data).then(resData => {
                self.$event.emit('reloadEntry')
              })  
            }, 100)
            return
          }
          self.$notice.toast({ message: '账号或密码错误' })  
        }, error => {
          self.$notice.loading.hide()
          self.$notice.toast({ message: "登录失败，请重试" })
        })
      },

      agreementClicked () {
        this.$router.toWebView({
          url: 'https://maimaituiguang.github.io/mm-web/agreement.html',
          title: '协议',
          navShow: true
        })
      },

      cardSwitch(e) {
        this.$emit('switchToCard', e)
      }
    }
  }
</script>

<style scoped>
  .login-page {
    align-items: center;
    background-color: #ffffff;
    width: 750px;
  }
  .user-avator {
    width: 130px;
    height: 130px;
    border-radius: 7px;
    margin-bottom: 30px;
  }
  .cell {
    width: 710px;
  }
  .cell-label {
    width: 150px;
    font-size: 36px;
  }
  .cell-title {
    width: 450px;
    height: 60px;
  }
  .cell-code {
    border-width: 1px;
    border-color: #999;
    padding: 10px;
    border-radius: 7px;
    font-size: 20px;
  }
  .xieyi {
    flex-direction: row;
    justify-content: center;
    width: 750px;
    margin-bottom: 20px;
    padding: 20px;
  }
  .switch-scope {
    align-items: center;
    width: 750px;
    flex-direction: row;
    justify-content: space-between;
  }
  .left-btn {
    font-size: 30px; 
    color: #4BB93B; 
    padding: 40px; 
    margin-left: 20px;
  }
  .right-btn {
    font-size: 26px; 
    padding: 40px; 
    color: #444; 
    margin-right: 20px;
  }
  
</style>