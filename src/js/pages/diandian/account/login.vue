<template>
<div class="container">
  <text style="font-size: 45px;">密码登录</text>
  <div class="xieyi">
    <text style="color: #999; font-size: 22px;">登录即表示同意 </text>
    <text style="color: #4BB93B; font-size: 22px;" @click="agreementClicked">麦麦推广协议</text>
  </div>
  <div style="align-items: flex-end; width: 750px;">
    <wxc-cell class="cell" :has-bottom-border="true">
      <text class="cell-label" slot="label">手机号</text>
      <input class="cell-title" max-length=11 slot="title" placeholder="请填写手机号码" type="number" @input="(e)=>{this.phone = e.value}" @change="phoneChanged" />
    </wxc-cell>
    <wxc-cell class="cell" :has-bottom-border="true">
      <text class="cell-label" slot="label">密码</text>
      <input class="cell-title" slot="title" type="password" placeholder="请输入密码" @input="(e)=>{this.code = e.value}" />
    </wxc-cell>
  </div>
  <wxc-button :btnStyle="btnStyle" 
              :text="title" 
              :disabled="!(this.phone!='' && this.code!='')" 
              @wxcButtonClicked="submit">
              </wxc-button>
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
          width: 630+'px', 
          height: 80+'px',
          fontSize: 32+'px',
          marginTop: 40+'px'
        },
        title: '登录',
        phone: '',
        code: ''
      }
    },
    created () {},
    methods: {
      submit () {
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
            self.$notice.toast({ message: self.title+'成功' })
            self.$storage.set('account', resData.data).then(resData => {
              self.$router.back({type:'PRESENT'})
              setTimeout(() => {
                self.$event.emit('reloadEntry')
              }, 300);
            })  
            return
          }
          self.$notice.toast({ message: '账号或密码错误' })  
        }, error => {
          self.$notice.loading.hide()
          self.$notice.toast({ message: self.title+'失败' })
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
  .container {
    align-items: center;
    background-color: #ffffff;
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
  
</style>