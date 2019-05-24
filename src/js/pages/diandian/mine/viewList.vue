<template>
  <list :style="{height: listHeight + 'px'}" ref="list" :show-scrollbar="false" :showRefresh="true" @refresh="onrefresh">
    <cell v-for="item in lists" :key="item.id" style="background-color: #ffffff">
      <TaskCell :item="item" style="margin-left: 40px; margin-right: 40px;" />
    </cell>
  </list>
</template>

<script>
import TaskCell from '../components/taskCell'
import { host } from '../../../config/base'
import Tools from '../tools'

export default {
  props: {
    status: {
      type: Number,
      default: 0
    },
    listHeight: {
      type: Number,
      default: 750
    }
  },
  components: { TaskCell },
  data: () => ({
    lists: [],
    account: {}
  }),
  created () {
    this.account = this.$storage.getSync('account')
    this.query().then(data => {
      this.lists = data
      this.$refs['list'].refreshEnd()
    })
  },
  methods: {
    onrefresh () {
      this.query().then(data => {
        this.lists = data
        this.$refs['list'].refreshEnd()
      })
    },
    loadMore () {
      this.query(this.lists.length).then(data => { 
        this.lists.push(...data)
        this.$refs['list'].loadMoreEnd()
      })
    },
    async query () {
      var list = []
      await this.$fetch({
        method: 'GET',
        url: host + '/view-task/' + this.status,
        header: {
          zc_0: Tools.zc_0()
        }
      }).then(resData => {
        list = resData
      }, error => {
        this.$refs['list'].refreshEnd()
        this.$refs['list'].loadMoreEnd()
      })
      return list
    }
  }
}
</script>
