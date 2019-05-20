<template>
  <div>
    <list ref="list" :show-scrollbar="false" :showRefresh="false" @refresh="onrefresh">
      <cell>
        <wxc-cell title="银行卡号"
                  :has-arrow="true"
                  :has-top-border="true"
                  :has-bottom-border="true">
          <input class="input" placeholder="请输入银行卡号" :value="number" @input="(e)=>{this.number=e.value}" return-key-type="done"></input>
        </wxc-cell>
      </cell>
      <cell>
        <wxc-cell title="开户行"
                  :has-arrow="true"
                  :has-top-border="false"
                  :has-bottom-border="true">
          <input class="input" placeholder="请输入开户行" :value="bank" @input="(e)=>{this.bank=e.value}" return-key-type="done" ></input>
        </wxc-cell>
      </cell>
      <cell>
        <wxc-cell title="姓名"
                  :has-arrow="true"
                  :has-top-border="false"
                  :has-bottom-border="true">
          <input class="input" placeholder="请输入姓名" :value="userName" @input="(e)=>{this.userName=e.value}" return-key-type="done" ></input>
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
      card: '',
      userName: '',
      bank: '',
      isLoading: false
    }),
    created () {
      this.$router.getParams().then(resData => {
        this.number = resData.number
        this.userName = resData.userName
        this.bank = resData.bank
      })
    },
    methods: {
      save () {
        if (this.number.length == 0 || this.userName.length == 0 || this.bank == 0) {
          return
        }
        const self = this
        this.isLoading = true
        this.$fetch({
          method: 'POST',
          name: 'mine.update',
          header: {
            zc_0: Tools.zc_0()
          },
          data: {
            card: {'number': self.number, 'userName': self.userName, 'bank': self.bank}
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