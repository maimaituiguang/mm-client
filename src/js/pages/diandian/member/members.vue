<template>
  <div>
    <list ref="list" :show-scrollbar="false" :showRefresh="true" @refresh="onrefresh">
      <cell>
        <div>
          <image class="bg-member" resize="cover" src="https://pic3.zhimg.com/v2-41de461f887dd4e14f82c29c78c38d7f.png" />
          <div class="user-container">
            <image class="user-avator" src="https://pic1.zhimg.com/da8e974dc.jpg" />
            <div style="margin-left: 20px;">
              <text style="color: white; font-size: 30px; font-weight: bold;">{{this.data.nick}}</text>
              <div style="flex-direction:row; align-items: center; margin-top: 5px;">
                <text class="sub-text">{{this.data.role_name}} ∙ 佣金 </text>
                <text style="font-size: 35px; color: #FE802B">{{this.data.role == 0 ? 0 : this.data.reward}}</text>
                <text class="sub-text"> 元/份</text>
              </div>
            </div>
          </div>
        </div>
      </cell>
      <cell v-for="(item, index) in lists" :key="item.type" v-if="item.type != 0" >
        <div class="member-container" :style="{borderColor: selected == index ? '#AF9B71' : '#dddddd'}" @click="onClicked(index)">
          <div>
            <text :style="{fontSize:30+'px', fontWeight:'bold', color:selected == index ? '#AF9B71' : 'black'}">{{item.name}}</text>
            <wxc-rich-text style="margin-top:10px;" :config-list="[
              {
                type: 'text',
                value: '佣金：'+item.reward+'元 x 3份=',
                style: {color:'#999', fontSize:'24px'}
              },
              {
                type: 'text',
                value: item.reward * 3,
                style: {fontSize: '30px', color:'#AF9B71', fontWeight: bold}
              },
              {
                type: 'text',
                value: '元/天',
                style: {color:'#999', fontSize:'24px'}
              },
            ]"></wxc-rich-text>
          </div>
          <wxc-rich-text :config-list="[
              {
                type:'text',
                value: '￥',
                style: {color: '#AF9B71'}
              },
              {
                type:'text',
                value: item.price,
                style: {color: '#AF9B71', fontSize: '44px', fontWeight: bold}
              }
            ]"></wxc-rich-text>
        </div>
      </cell>
      <cell v-if="lists.length > 0">
        <wxc-button :btnStyle="btnStyle" text="开通会员" @wxcButtonClicked="memberClicked"></wxc-button>
      </cell>
    </list>
    <wxc-popup :show="isBottomShow"
               @wxcPopupOverlayClicked="popupOverlayBottomClick"
               pos="bottom"
               :height="popupHeight">
      <text style="font-size: 32px; font-weight:bold; padding-top:40px; text-align:center;">请选择支付方式</text>
      <div style="flex-direction: row; justify-content: center; margin-top: 40px;">
        <wxc-button :btnStyle="{width: '300px', backgroundColor:'#33A449'}" text="微信" @wxcButtonClicked="payClicked('weixin')" />
        <wxc-button :btnStyle="{width: '300px', backgroundColor:'#2E7DCE', marginLeft: '40px'}" text="支付宝" @wxcButtonClicked="payClicked('alipay')" />
      </div>
    </wxc-popup>
  </div>
</template>

<script>

import { WxcButton, Utils, WxcPopup, WxcRichText} from 'weex-ui'
import Tools from '../tools'

export default {
  components: { WxcButton, WxcPopup, WxcRichText },
  data: () => ({
    data: {},
    lists: [],
    selected: 1,
    btnStyle: { backgroundColor: '#AF9B71', marginLeft: 40+'px', width: 670+'px', marginTop: 20+'px' },
    isBottomShow: false,
    popupHeight: 280
  }),
  created () {
    const iphoneX = Utils.env.isIPhoneX()
    this.popupHeight = iphoneX ? 320 : 280

    this.$storage.get('account').then(resData => {
      this.data = resData
    }),
    this.$fetch({
      method: 'GET',
      name: 'mine.members'
    }).then(resData => {
      this.lists = resData
    }, error => {
      this.$notice.toast({ message: '数据请求失败' })
    })
  },
  methods: {
    onClicked (index) {
      this.selected = index
    },
    popupOverlayBottomClick () {
      this.isBottomShow = false
    },
    memberClicked () {
      // this.isBottomShow = true
      this.payClicked('weixin')
    },
    onrefresh () {
      this.$fetch({
        method: 'GET',
        name: 'mine.account',
        header: {
          zc_0: Tools.zc_0()
        }
      }).then(resData => {
        this.$refs['list'].refreshEnd()
        if (resData.success == '1') {
          this.$storage.set('account', resData.data).then(resData => {
            this.role = resData.role
            this.roleName = resData.roleName
          })
        }
      }, error => {
        this.$refs['list'].refreshEnd()
        this.$notice.toast({ message: '数据请求失败' })
      })
    },
    payClicked (e) {
      this.isBottomShow = false
      if (e=='weixin') {
        this.$router.open({name: 'member.pay', type:'PRESENT', params:{payType:e, price: this.lists[this.selected].price}})
        return
      }

      if (e=='alipay') {
        var url = ''
        const price = this.lists[this.selected].price
        const self = this
        if (price == 298) {
          url = 'https://qr.alipay.com/fkx02931ecoj7cdzmd9red4'
        } else if (price == 698) {
          url = 'https://qr.alipay.com/fkx09125ljk4kfgye8rdrd9'
        } else if (price == 1498) {
          url = 'https://qr.alipay.com/fkx08352s48m8wwhn1yon6a'
        } else if (price == 2998) {
          url = 'https://qr.alipay.com/fkx02259uomcfaucjm9w70a'
        }

        self.$router.openBrowser(url)
        // this.$notice.alert({
        //   title: '提示：支付时请务必备注上您的手机号',
        //   message: '',
        //   okTitle: '确认',
        //   callback() {
            
        //   }
        // })
      }
      
    }
  }
}
</script>

<style scoped>
  .bg-member {
    width: 670px;
    height: 200px;
    border-radius: 10px;
    margin-left: 40px;
    margin-top: 40px;
    margin-bottom: 40px;
    background-color: #eee;
  }
  .user-avator {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    border-width: 4px;
    border-color: white;
  }
  .user-container {
    width: 670px;
    height: 200px;
    position: absolute;
    top: 40px;
    left: 40px;
    padding-left: 50px;
    flex-direction:row;
    align-items: center;
  }
  .sub-text {
    color: #B6C9D9; 
    font-size: 24px;
  }
  .member-container {
    width: 670px;
    height: 150px;
    border-width: 4px;
    border-radius: 10px;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
    margin-left: 40px;
    justify-content: space-between;
    padding-left: 30px;
    padding-right: 30px;
  }
</style>
