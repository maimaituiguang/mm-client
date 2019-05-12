<template>
  <div class="container">
    <text style="font-size: 45px;">手机号注册</text>
    <image class="user-avator" src="https://pic1.zhimg.com/da8e974dc.jpg"></image>
    <div style="align-items: flex-end; width: 750px;">
      <wxc-cell class="cell" :has-bottom-border="true">
        <text class="cell-label" slot="label">昵称</text>
        <input class="cell-title" slot="title" placeholder="例如：七麦" @input="nickInput" />
      </wxc-cell>
      <wxc-cell class="cell" :has-bottom-border="true">
        <text class="cell-label" slot="label">手机号</text>
        <input class="cell-title" max-length=11 slot="title" placeholder="请填写手机号码" type="number" @input="phoneInput" @change="phoneChanged" />
        <text v-if="phone.length == 11" class="cell-code" :style="codeStyle" slot="value" @click="fetchCode">{{codeText}}</text>
      </wxc-cell>
      <wxc-cell class="cell" :has-bottom-border="true">
        <text class="cell-label" slot="label">验证码</text>
        <input class="cell-title" slot="title" type="number" placeholder="请输入验证码" @input="codeInput" />
      </wxc-cell>
    </div>
    <wxc-button :btnStyle="btnStyle" text="注册" :disabled="(this.nick!='' && this.phone!='' && this.code!='') == false" @wxcButtonClicked="submit"></wxc-button>
  </div>
</template>
<script>
  import { WxcCell, wxcButton } from 'weex-ui'
  const sms = weex.requireModule('smsCode')

  export default {
    components: {WxcCell, wxcButton},
    data () {
      return {
        btnStyle: {
          backgroundColor:'#4BB93B', 
          width: 600+'px', 
          height: 70+'px',
          fontSize: 32+'px',
          marginTop: 40+'px'
        },
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
      this.$navigator.setNavigationInfo({ navShow: true })
      // this.$navigator.setLeftItem({ 
      //   text: '取消', 
      //   textColor: '#4BB93B' }, 
      // () => {
      //   this.$router.back({type:'PRESENT'})
      // })
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

          self.$fetch({
            method: 'POST',
            name: 'account.register',
            data: {
              nick: self.nick,
              phone: self.phone,
              code: self.code
            }
          }).then(resData => {
            self.$notice.loading.hide()
            if (resData.success == '1') {
              self.$notice.toast({ message: '注册成功' })
              self.$storage.set('account', resData.data).then(resData => {
                self.$event.emit('registerSuccess')
                setTimeout(() => {
                  self.$router.back({type:'PRESENT'})  
                }, 1000);
              })
              
              return
            }
            self.$notice.toast({ message: '注册失败, 请重试' })  
          }, error => {
            self.$notice.toast({ message: '注册失败' })
          })

        })
      },
      nickInput (e) {
        this.nick = e.value
      },
      phoneInput (e) {
        this.phone = e.value
      },
      codeInput (e) {
        this.code = e.value
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
            this.isTimering = false
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
      }
    }
  }
</script>

<style scoped>
  .container {
    align-items: center;
    background-color: #fff;
  }
  .user-avator {
    width: 130px;
    height: 130px;
    border-radius: 7px;
    margin-top: 60px;
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
  
</style>