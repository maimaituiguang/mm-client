<template>
  <div class="container">
    <list ref="list" :show-scrollbar="false" :showRefresh="false">
    <cell class="cell-temp-line"></cell>
      <cell v-for="item in list">
        <wxc-cell :has-arrow="item.account_status == 0"
                  :has-top-border="false"
                  :has-bottom-border="true",
                  @wxcCellClicked="didTapCell(item)">
          <div slot="title">
            <div class="cell-layout">
              <image class="user-avator" :src="'https://maimaituiguang.github.io/mm-web/images/'+(item.role==0?'user':'vip')+'.png'"></image>
              <div class="title-layout">
                <text class="nick">{{item.nick}}</text>
                <text :style="{color:(item.role != 0?'#FE802B':'#999'), fontSize:'26px' }">{{item.role_name}}</text>
                <text class="ID">ID: {{item.user_id}}</text>
              </div>
            </div>
          </div>
          <text slot="value" :style="{marginRight:'20px',color:(item.account_status!=0||item.task_status!=0)?'#d43f3a':'#999'}">{{item.account_status_name}}</text>
        </wxc-cell>
      </cell>
    </list>
  </div>
</template>

<script>
import {Utils, WxcCell } from 'weex-ui'
import Tools from '../tools'

export default {
    components: {Utils, WxcCell},
    data: () => ({
      list: []
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
          this.$notice.toast({message: '创建失败，请重试'})
        })
      },
      
      didTapCell (item) {
        if (item.account_status != 0) {
          return
        }
        const self = this
        this.$storage.set('account', item).then(resData => {
          self.$event.emit('reloadEntry')
          self.$router.back({type: 'PUSH'})
        })

      },
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
    margin-bottom: 10px;
  }
  .ID {
    color: #999;
    font-size: 24px;
    margin-top: 10px;
  }
</style>
