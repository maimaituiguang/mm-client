<template>
  <div>
    <list ref="list" :show-scrollbar="false" :showRefresh="false" @refresh="onrefresh">
      <cell>
        <wxc-cell style="margin-top:20px" title="头像"
                  :has-arrow="true"
                  @wxcCellClicked="avatorClicked"
                  :has-top-border="true"
                  :has-bottom-border="true">
          <image class="user-avator" :src="avator"></image>
        </wxc-cell>
      </cell>
      <cell>
        <wxc-cell title="昵称"
                  :has-arrow="true"
                  :has-top-border="false"
                  :has-bottom-border="true">
          <input class="input" :value="nick" @input="(e)=>{this.nick=e.value}" return-key-type="done" ></input>
        </wxc-cell>
      </cell>
      <cell>
        <wxc-cell title="支付宝账号"
                  :has-arrow="true"
                  :has-top-border="false"
                  :has-bottom-border="true">
          <input class="input" :value="alipay" @input="(e)=>{this.alipay=e.value}" return-key-type="done"></input>
        </wxc-cell>
      </cell>
      <cell style="width: 750px;">
        <wxc-button :btnStyle="{backgroundColor:'#FE802B', width:'670px', margin:'40px'}" text="保存" @wxcButtonClicked="save"></wxc-button>
      </cell>
    </list>
    <wxc-loading :show="isLoading" ></wxc-loading>
  </div> 
</template>

<script>
  import { WxcButton, Utils, WxcCell, WxcLoading } from 'weex-ui'
  import Tools from '../tools'

  export default {
    components: {WxcButton, Utils, WxcCell, WxcLoading},
    data: () => ({
      avator: 'https://pic1.zhimg.com/da8e974dc.jpg',
      nick: '',
      alipay: '',
      isLoading: false
    }),
    created () {
      this.$storage.get('avator').then(resData => {
        this.avator = resData
      })
      this.$router.getParams().then(resData => {
        this.nick = resData.nick
        this.alipay = resData.alipay
      })
    },
    methods: {
      avatorClicked () {
        this.$image.pick({
          imageWidth: '400',                  
          allowCrop: true                  
        })
        .then(resData => {
          this.avator = resData[0]
          this.$storage.set('avator', resData[0]).then(resData => {})

        }, error => {
          this.$notice.toast({message: '图片选取失败'})
        })
      },
      save () {
        this.isLoading = true
        this.$fetch({
          method: 'POST',
          name: 'mine.update',
          header: {
            zc_0: Tools.zc_0()
          },
          data: {
            nick: this.nick,
            alipay: this.alipay
          }
        }).then(resData => {
          this.isLoading = false
          if (resData.success == '1') {
            this.$notice.toast({ message: '保存成功' })
            this.$event.emit('refreshAccount')
            return
          }
          this.$notice.toast({ message: '保存失败, 请重试' })  
        }, error => {
          this.isLoading = false
          this.$notice.toast({ message: '保存失败' })
        })
      }
    }
  }
</script>

<style scoped>
  .user-avator {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    margin-right: 20px;
    background-color: #ccc;
  }
  .input {
    width: 400px;
    height: 60px;
    text-align: right;
    margin-right: 20px;
  }
</style>