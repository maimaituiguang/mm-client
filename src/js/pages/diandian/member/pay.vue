<template>
  <div style="background-color: #fff;">
    <list v-if="isShowPage" :show-scrollbar="false" :showRefresh="false">
      <cell class="container">
        <text style="color:red; text-align:center;">{{headerTip}}</text>
        <image ref="imageQR" class="qrcode" resize="contain" :src="qrcode" @load="onImageLoad"></image>
        <image class="guide" resize="contain" src="https://maimaituiguang.github.io/mm-web/images/weixin_guide.jpg"></image>
        <wxc-button 
          :btnStyle="{width: '600px', backgroundColor:(this.payType == 'weixin'?'#33A449':'#2E7DCE')}" 
          :text="'保存图片🔗跳转到'+(this.payType == 'weixin' ? '微信' : '支付宝')" 
          @wxcButtonClicked="payClicked" />
      </cell>
    </list>
    <!-- <wxc-dialog title="提示"
                content="自动支付渠道正在安全性加固，可暂时选择二维码方式支付"
                :show="isDialogShow"
                @wxcDialogConfirmBtnClicked="(e)=>{this.isDialogShow = false}"
                :single="true">
    </wxc-dialog> -->
  </div>
</template>

<script>
  import { WxcButton, Utils, WxcDialog} from 'weex-ui'
  import Tools from '../tools'

  export default {
    components: { WxcButton, Utils, WxcDialog},
    data: () => ({
      payType: '',
      price: 0,
      isShowPage: true,
      isDialogShow: false
    }),
    created () {
      this.$router.getParams().then(resData => {
        this.payType = resData.payType
        this.price = resData.price
        this.qrcode = 'https://maimaituiguang.github.io/mm-web/images/'+this.payType+'.jpg'
        this.$notice.loading.show('')
        this.headerTip = '请支付 '+this.price+' 元'
      })

      // setTimeout(() => {
      //   this.isLoadingShow = false
      //   this.isDialogShow = true
      //   this.isShowPage = true
      // }, 1000)
    },
    methods: {
      onImageLoad (e) {
        this.$notice.loading.hide()
      },

      payClicked () {
        const url = 'https://maimaituiguang.github.io/mm-web/pay.html?'+'type='+this.payType+'&price='+this.price
        // 保存图片
        this.$refs['imageQR'].save(function(result) {})
        // 复制 url
        // this.$tools.copyString(url)

        const self = this
        this.$notice.alert({
          title: '提示：支付时请务必备注上您的手机号',
          message: '',
          okTitle: '确认',
          callback() {
            self.$router.openBrowser(url)    
          }
        })
      }
    }
  }
</script>

<style scope>
  .container {
    padding: 40px; 
    align-items:center;
  }
  .title {
    font-weight: bold;
    font-size: 44px;
  }
  .des {
    padding-top: 20px
  }
  .qrcode {
    width: 500px;
    height: 500px;
    margin-top: 40px;
  }
  .guide {
    width: 670px;
    height: 300px;
  }
</style>