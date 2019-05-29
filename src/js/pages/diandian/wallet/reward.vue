<template>
  <div>
    <Nav navTitle="提现" leftText="取消" @navLeftClicked="back" />
    <scroller alwaysScrollableVertical="true">
      <div class="page-container">
        <div class="reward-header">
          <text style="font-size: 28px; margin-left: 60px;">到银行卡</text>
          <div class="reward-ali-info">
            <text style="font-size: 28px; font-weight: bold;">{{card.hasOwnProperty('number') ? card.number : '请设置银行卡号'}}</text>
            <text style="font-size: 26px; color: #777; margin-top: 20px;">1-3 个工作日到账, 不超过 4 天</text>
            <text style="font-size: 22px; color: blue; margin-top: 20px;">手续费 2%，最低 2 元</text>
          </div>
        </div>
        <div style="margin-left: 40px; margin-right: 40px;">
          <text style="font-size: 30px; margin-top: 40px; margin-bottom: 20px;">提现金额</text>
          <div class="input-container">
            <text class="input-rmb-icon">&#xe629;</text>
            <input class="reward-input" :value="inputValue" type="number" @input="oninput" return-key-type="done" />
          </div>
          <div class="input-line"></div>
          <div style="margin-top: 20px; flex-direction: row;">
            <text style="font-size: 26px; color: #777; padding-top: 20px; padding-bottom: 20px;">可提现金额: {{canTake}}</text>
            <text style="font-size: 26px; color: #3268C7; padding-top: 20px; padding-bottom: 20px;" @click="allReward">，全部提现</text>
          </div>
          <wxc-button class="reward-button" :btnStyle="btnStyle"  :disabled="!(inputValue > 0 && inputValue <= parseFloat(canTake) && card.hasOwnProperty('number'))" text="提现" @wxcButtonClicked="reward"></wxc-button>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import { WxcButton, Utils } from 'weex-ui'
  import Nav from '../components/Nav'
  import Tools from '../tools'

  export default {
    components: {WxcButton, Utils, Nav},
    data: () => ({
      btnStyle: {
        width: 590+'px',
        marginTop: 40+'px',
        marginBottom: 50+'px'
      },
      buttonEnable: false,
      card: {},
      canTake: '0.00',
      inputValue:''
    }),
    eros: {
      beforeAppear (params, options) {
        this.$navigator.setNavigationInfo({ navShow: false })

        this.$router.getParams().then(resData => {
          this.canTake = resData.unTake
        })
      }
    },
    created () {
      const domModule = weex.requireModule('dom')
      domModule.addRule('fontFace', {
        fontFamily: 'rdIconfont',
        src: `url('http://at.alicdn.com/t/font_1154282_ri5zfu0g89.ttf')`
      })

      this.$storage.get('account').then(resData => {
        if (resData.hasOwnProperty("card")) {
          this.card = resData.card
        } 
      })
    },
    methods: {
      back () {
        this.$router.back({ type: 'PRESENT' })
      },
      allReward () {
        this.inputValue = this.canTake
      },
      oninput (e) {
        this.inputValue = e.value
      },
      reward () {
        if (!(this.inputValue > 0 && this.inputValue <= parseFloat(this.canTake) && this.alipay != '请设置支付宝账号')) {
          return
        }

        this.$notice.loading.show()
        this.$fetch({
          method: 'POST',
          name: 'wallet.take',
          header: {
            zc_0: Tools.zc_0()
          },
          data: {
            count: parseFloat(this.inputValue)
          }
        }).then(resData => {
          this.$notice.loading.hide()
          if (resData.success == '1') {
            this.$notice.toast({ message: '提现成功，1～3 个工作日到账'})
            this.canTake = Tools.toDecimal2(parseFloat(this.canTake) - parseFloat(this.inputValue))
            this.inputValue = ''
            this.$event.emit('updateWallet')
            return
          }
          this.$notice.toast({ message: '提交失败，请重试' })  
        }, error => {
          this.$notice.loading.hide()
          this.$notice.toast({ message: '提交失败' })
        })
      }
    }
  }
</script>

<style scoped>
  .page-container {
    background-color: #fff;
    border-radius: 6px;
    margin: 40px;
  }
  .reward-header {
    flex-direction: row;
    padding-top: 40px;
    padding-bottom: 20px;
    background-color: #FBFBFB;
  }
  .reward-ali-info {
    margin-left: 40px;
  }
  .input-container {
    flex-direction: row;
  }
  .reward-input {
    height: 120px;
    width: 400px;
    font-size: 100px;
    font-weight: bold;
    margin-left: 20px;
  }
  .input-line {
    margin-top: 10px;
    height: 0.5px;
    background-color: #ccc;
  }
  .input-rmb-icon {
    font-family: rdIconfont; 
    font-size: 60px; 
    font-weight: bold; 
    margin-top: 30px;
  }
</style>