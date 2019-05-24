<template>
<div>
  <div class="container" :style="containerStyle">
    <text style="font-size: 45px;">短信验证{{title}}</text>
    <div class="xieyi">
      <text style="color: #999; font-size: 22px;">登录注册表示同意 </text>
      <text style="color: #4BB93B; font-size: 22px;" @click="agreementClicked">麦麦推广协议</text>
    </div>
    <!-- <image v-if="!type" class="user-avator" src="https://pic1.zhimg.com/da8e974dc.jpg"></image> -->
    <div style="align-items: flex-end; width: 750px;">
      <wxc-cell v-if="!type" class="cell" :has-bottom-border="true">
        <text class="cell-label" slot="label">昵称</text>
        <input class="cell-title" slot="title" placeholder="例如：陈峰" @input="(e)=>{this.nick = e.value}" />
      </wxc-cell>
      <wxc-cell class="cell" :has-bottom-border="true">
        <text class="cell-label" slot="label">手机号</text>
        <input class="cell-title" max-length=11 slot="title" placeholder="请填写手机号码" type="number" @input="(e)=>{this.phone = e.value}" @change="phoneChanged" />
        <text v-if="phone.length == 11" class="cell-code" :style="codeStyle" slot="value" @click="fetchCode">{{codeText}}</text>
      </wxc-cell>
      <wxc-cell class="cell" :has-bottom-border="true">
        <text class="cell-label" slot="label">验证码</text>
        <input class="cell-title" slot="title" type="number" placeholder="请输入验证码" @input="(e)=>{this.code = e.value}" />
      </wxc-cell>
    </div>
    <wxc-button :btnStyle="btnStyle" 
                :text="title" 
                :disabled="((this.nick!='' || this.type==1 ) && this.phone!='' && this.code!='') == false" 
                @wxcButtonClicked="submit">
                </wxc-button>
    <div style="align-items: flex-start; width: 750px;" @click="(e)=>{this.type = !this.type; this.title = this.type?'登录':'注册';}">
      <text style="font-size: 30px; color: #4BB93B; padding: 40px; margin-left: 20px;">切换到{{!type?'登录':'注册'}}</text>
    </div>
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
          width: 630+'px', 
          height: 80+'px',
          fontSize: 32+'px',
          marginTop: 40+'px'
        },
        title: '注册',
        type: 0,
        nick: '',
        phone: '',
        code: '',
        codeText: '获取验证码',
        isTimering: false,
        timer: 30,
        interval: ''
      }
    },
    created () {
      const pageHeight = Utils.env.getPageHeight()

      this.$navigator.setNavigationInfo({ navShow: true })
      this.$navigator.setLeftItem({
        image: 'https://maimaituiguang.github.io/mm-web/images/empty.jpg'
      })

      this.containerStyle = {width: '750px', height: pageHeight + 'px'}

      if (Utils.env.isAndroid()) {
        sms.initSMS()
      }
    },
    deforeDestroy () {
      if (Utils.env.isAndroid()) {
        sms.unregisterEventHandler()
      }
    },
    methods: {
      submit () {
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
            code: self.code
          }
          const login = {
            phone: self.phone,
            code: self.code
          }

          self.$fetch({
            method: 'POST',
            name: 'account.register',
            data: self.type ? login : register
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
            self.$notice.toast({ message: self.title+'失败, 请重试' })  
          }, error => {
            self.$notice.toast({ message: self.title+'失败' })
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
            self.interval = setInterval(function(){
              self.runTimerCode()
            },1000)
          } else {
            self.$notice.toast({message: '发送失败，请重试'})
            self.isTimering = false
          }
        })
      },
      runTimerCode () {
        this.codeText = this.timer + ' 秒后重试'
        this.timer -= 1
        if  (this.timer == -1) {
          this.isTimering = false
          clearInterval(this.interval)
          this.timer = 0
          this.codeText = '获取验证码'
        }
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