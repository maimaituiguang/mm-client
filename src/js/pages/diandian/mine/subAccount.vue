<template>
  <div class="container">
    <list ref="list" :show-scrollbar="false" :showRefresh="false">
    <cell class="cell-temp-line"></cell>
      <cell v-for="item in list" v-bind:key="item.user_id">
        <wxc-cell :has-arrow="item.account_status == 0"
                  :has-top-border="false"
                  :has-bottom-border="true"
                  @wxcCellClicked="didTapCell(item)">
          <div slot="title">
            <div class="cell-layout">
              <image class="user-avator" :src="'https://maimaituiguang.github.io/mm-web/images/'+(item.role==0?'user':'vip')+'.png'"></image>
              <div class="title-layout">
                <div class="title-container">
                  <text class="nick">{{item.nick}}</text>
                  <text v-if="!item.sub_password" class="set-password" @click="didTapPassword(item)">设置密码</text>
                </div>
                <text :style="{color:(item.role != 0?'#FE802B':'#999'), fontSize:'26px' }">{{subRoleName(item)}}</text>
                <text class="ID">ID: {{item.user_id}}</text>
              </div>
            </div>
          </div>
          <text slot="value" :style="{marginRight:'20px',color:(item.account_status!=0||item.task_status!=0)?'#d43f3a':'#999'}">{{item.account_status_name}}</text>
        </wxc-cell>
      </cell>
    </list>
    <wxc-mask height="450" width="600" border-radius="10" duration="200" mask-bg-color="#FFFFFF"
              :has-animation="hasAnimation"
              :has-overlay="true"
              :show-close="true"
              :show="setShow"
              @wxcMaskSetHidden="()=> {setShow = false}"
              @wxcMaskCloseClick="()=> {setShow = false}"
              @wxcOverlayBodyClicked="()=> {setShow = false}">
      <div class="mask-content">
        <div class="input-container">
          <text>超级密码</text>
          <input class="input" placeholder="拥有账号的所有权" @input="(e)=> {this.superPassword=e.value}" type="password" :value="superPassword" />
        </div>
        <div class="input-container">
          <text>登陆密码</text>
          <input class="input" placeholder="可操作账号的部分功能" @input="(e)=>{this.nomalPassword=e.value}" type="password" :value="nomalPassword" />
        </div>
        <text class="submit-button" @click="submitPassword()">保存</text>
        <text style="color: red; text-align: center; font-size: 26px; margin-top: 40px;">提示：每个子账号只可设置一次密码，请务必铭记</text>
      </div>
    </wxc-mask>
    <wxc-mask height="280" width="600" border-radius="10" duration="200" mask-bg-color="#FFFFFF"
              :has-animation="hasAnimation"
              :has-overlay="true"
              :show-close="false"
              :show="performShow"
              @wxcMaskSetHidden="()=> {performShow = false}"
              @wxcMaskCloseClick="()=> {performShow = false}"
              @wxcOverlayBodyClicked="()=> {performShow = false}">
      <div class="mask-content">
        <div class="input-container">
          <text>输入密码</text>
          <input class="input" placeholder="超级密码或登陆密码" @input="(e)=> {this.performPassword=e.value}" type="password" :value="performPassword" />
        </div>
        <text class="submit-button" @click="perform">确定</text>
      </div>
    </wxc-mask>
  </div>
</template>

<script>
import {Utils, WxcCell, WxcMask} from 'weex-ui'
import Tools from '../tools'

export default {
    components: {Utils, WxcCell, WxcMask},
    data: () => ({
      list: [],
      setShow: false,
      performShow: false,
      superPassword: "",
      nomalPassword: "",
      performPassword: "",
      item: null
    }),
    created () {
      this.fetchList()
      this.$navigator.setRightItem({
        text: '创建',
        textColor: 'black',
        fontSize: '32',
        fontWeight: 'normal',
      }, () => {
        this.createAccount()
      })
    },
    eros: {
      beforeDisappear (options) {
        this.$notice.loading.hide()
      }
    },
    methods: {
      fetchList () {
        this.$notice.loading.show()
        this.$fetch({
          method: 'GET',
          name: 'mine.subAccountList',
          header: {
            zc_0: Tools.zc_0_sup()
          }
        }).then(resData => {
          this.$notice.loading.hide()
          this.list = resData
        }, error => {
          this.$notice.loading.hide()
        })
      },

      createAccount () {
        this.$notice.loading.show()
        this.$fetch({
          method: 'GET',
          name: 'mine.addAccount',
          header: {
            zc_0: Tools.zc_0_sup()
          }
        }).then(resData => {
          this.$notice.loading.hide()
          if (resData.success == 1) {
            this.list.push(resData.message)
            return
          }
          this.$notice.toast({message: resData.message})
        }, error => {
          this.$notice.loading.hide()
          this.$notice.toast({message: '创建失败，请重试'})
        })
      },
      
      didTapCell (item) {
        if (item.account_status != 0) {
          return
        }

        if (item.hasOwnProperty('sub_password')) {
          this.performShow = true
          this.performPassword = ""
          this.item = item
          return
        }

        const self = this
        this.$storage.set('account', item).then(resData => {
          self.$event.emit('reloadEntry')
          self.$router.back({type: 'PUSH'})
        })
      },

      subRoleName(item) {
        if (item.role < 10) {
          return item.role_name
        }
        return item.role_name.slice(0, item.role_name.indexOf('('))
      },

      didTapPassword(item) {
        this.superPassword = ""
        this.nomalPassword = ""
        this.setShow = true
        this.item = item
      },
      submitPassword() {
        if (this.superPassword.length == 0 || this.nomalPassword.length == 0) {
          this.$notice.toast({message: "请输入密码"})
          return
        }
        this.$notice.loading.show()
        this.$fetch({
          method: 'POST',
          name: 'mine.setSubPassword',
          data: {
            sub_account: this.item.phone,
            sub_most_password: this.superPassword,
            sub_password: this.nomalPassword
          }
        }).then(res => {
          this.$notice.loading.hide()
          this.$notice.toast({message: res.message})
          if (res.success == 1) {
            this.setShow = false
          }
        }, error => {
          this.$notice.loading.hide()
          this.$notice.toast({message: '设置失败，请重试'})
        })
      },

      perform() {
        if (this.performPassword != this.item.sub_most_password && this.performPassword != this.item.sub_password) {
          this.$notice.toast({message: "密码错误"})
          return
        }

        if (this.performPassword == this.item.sub_most_password) {
          this.item['owner'] = true
        } else if (this.performPassword == this.item.sub_password) {
          this.item['owner'] = false
        }
        
        const self = this
        this.$storage.set('account', this.item).then(resData => {
          self.$event.emit('reloadEntry')
          self.$router.back({type: 'PUSH'})
        })
      }
    }
}
</script>

<style scoped>
  .cell-temp-line {
    height: 0.5px;
    background-color: #ccc;
  }
  .user-avator {
    width: 80px;
    height: 80px;
    border-radius: 40px;
    margin-right: 20px;
    background-color: #ccc;
  }
  .cell-layout {
    flex-direction: row;
    background-color: #fff;
    padding-right: 20px;
    padding-left: 20px;
  }
  .title-layout{
    justify-content: space-around;
  }
  .nick {
    font-weight: bold;
  }
  .ID {
    color: #999;
    font-size: 24px;
    margin-top: 10px;
  }
  .title-container {
    flex-direction: row;
    align-items: center;
    height: 40px;
    margin-bottom: 10px;
  }
  .set-password {
    border-radius: 8px;
    background-color: #1f9452;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 10px;
    font-size: 26px;
    color: #fff; 
  }
  .mask-content {
    align-items: center;
    padding: 40px;
  }
  .input-container {
    flex-direction: row;
    align-items: center;
    height: 80px;
  }
  .input {
    border-width: 0.5px;
    border-style: solid;
    border-color: #1f9452;
    width: 320px;
    height: 64px;
    border-radius: 10px;
    margin-left: 20px;
    padding-left: 10px;
    font-size: 26px;
  }
  .submit-button {
    width: 480px;
    margin-top: 30px;
    background-color: #1f9452;
    border-radius: 10px;
    color: #ffffff;
    text-align: center;
    padding: 10px;
    font-weight: bold;
  }

</style>
