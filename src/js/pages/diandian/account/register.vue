<template>
<div class="register-page">
  <text style="font-size: 45px;">手机号注册</text>
  <div class="xieyi">
    <text style="color: #999; font-size: 22px;">注册表示同意 </text>
    <text style="color: #4BB93B; font-size: 22px;" @click="agreementClicked">麦麦推广协议</text>
  </div>
  <div style="align-items: flex-end; width: 750px;">
    <wxc-cell class="cell" :has-bottom-border="true">
      <text class="cell-label" slot="label">昵称</text>
      <input class="cell-title" slot="title" placeholder="例如：陈峰" @input="(e)=>{this.nick = e.value}" />
    </wxc-cell>
    <wxc-cell class="cell" :has-bottom-border="true">
      <text class="cell-label" slot="label">手机号</text>
      <input class="cell-title" max-length=11 slot="title" placeholder="请填写手机号码" type="number" @input="(e)=>{this.phone = e.value}" />
      <text v-if="phone.length == 11" class="cell-code" :style="codeStyle" slot="value" @click="fetchCode">{{codeText}}</text>
    </wxc-cell>
    <wxc-cell class="cell" :has-bottom-border="true">
      <text class="cell-label" slot="label">验证码</text>
      <input class="cell-title" slot="title" type="number" placeholder="请输入验证码" @input="(e)=>{this.code = e.value}" />
    </wxc-cell>
    <wxc-cell class="cell" :has-bottom-border="true">
      <text class="cell-label" slot="label">密码</text>
      <input class="cell-title" slot="title" type="password" placeholder="请输入 6 位以上密码" @input="(e)=>{this.password = e.value}" />
    </wxc-cell>
    <wxc-cell class="cell" :has-bottom-border="true">
      <text class="cell-label" slot="label">邀请码</text>
      <input class="cell-title" slot="title" type="number" placeholder="邀请码(选填)" @input="(e)=>{this.yaoCode = e.value}" />
    </wxc-cell>
  </div>
  <wxc-button :btnStyle="btnStyle" 
              text="注册" 
              :disabled="!(this.nick!='' && this.phone != '' && this.code!='' && this.password.length >= 6)" 
              @wxcButtonClicked="submit">
              </wxc-button>
  <div class="switch-scope">
    <text class="left-btn" @click="cardSwitch">切换到密码登录</text>
  </div>
</div>
</template>
<script>
  import { WxcCell, wxcButton, Utils } from 'weex-ui'
  const sms = weex.requireModule('smsCode')

  export default {
    components: {WxcCell, wxcButton},
    data () {
      return {
        btnStyle: {
          backgroundColor:'#4BB93B', 
          width: '630px', 
          height: '80px',
          fontSize: '32px',
          marginTop: '40px'
        },
        title: '注册',
        password: '',
        nick: '',
        phone: '',
        code: '',
        codeText: '获取验证码',
        isTimering: false,
        yaoCode: ''        
      }
    },
    methods: {
      submit () {
        if (this.nick == '' || this.phone == '' || this.password.length < 6) {
          return
        }

        this.$notice.loading.show()
        const self = this
        sms.checkCode(this.code, this.phone, function(resData){
          if (resData == 0) {
            self.$notice.loading.hide()
            self.$notice.toast({message: '验证码错误'})
            return
          }

          const register = {
            nick: self.nick,
            phone: self.phone,
            userID: parseInt(parseInt(self.phone) / 12345).toString(),
            code: self.code,
            password: self.password,
            yaoCode: self.yaoCode
          }
          
          self.$fetch({
            method: 'POST',
            name: 'account.register',
            data: register
          }).then(resData => {
            self.$notice.loading.hide()
            if (resData.success == '1') {
              setTimeout(() => {
                self.$notice.toast({ message: '注册成功' })
                self.$storage.set('account', resData.data).then(resData => {
                  self.$event.emit('reloadEntry')
                })
              }, 100)
              return
            }
            self.$notice.toast({ message: '注册失败, 请重试' })  
          }, error => {
            self.$notice.loading.hide()
            self.$notice.toast({ message: '注册失败' })
          })
        })
      },
      fetchCode () {
        if (this.isTimering) {
          return
        }

        this.isTimering = true
        this.$notice.loading.show()
        const self = this
        sms.getCode(this.phone, function (resData) {
          self.$notice.loading.hide()
          if (resData == 1) {
            self.runTimerCode(30)
          } else {
            self.$notice.toast({message: '发送失败，请重试'})
            self.isTimering = false
          }
        })
      },
      runTimerCode (count) {
        this.codeText = count + ' 秒后重试'
        count -= 1
        if  (count == -1) {
          this.isTimering = false
          this.codeText = '获取验证码'
          return
        }
        setTimeout(() => {
          this.runTimerCode(count)
        }, 1000)
      },

      agreementClicked () {
        this.$router.toWebView({
          url: 'https://maimaituiguang.github.io/mm-web/agreement.html',
          title: '协议',
          navShow: true
        })
      },

      cardSwitch() {
        this.$emit('switchToCard', 0)
      }
    }
  }
</script>

<style scoped>
  .register-page {
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
  
</style>