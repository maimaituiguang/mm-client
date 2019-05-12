<template>
  <list ref="list" :show-scrollbar="true" 
                   :showRefresh="true" 
                   @refresh="onrefresh"
                   showLoadMore="true"
                   @loadMore="loadMore" 
                   loadmoreoffset=3>
    <cell v-for="item in lists" :key="item.id" style="background-color: #ffffff">
      <TaskCell :item="item" style="margin-left: 40px; margin-right: 40px;" />
    </cell>
  </list>
</template>

<script>
import TaskCell from '../components/taskCell'
import { host } from '../../../config/base'

export default {
  components: { TaskCell },
  data: () => ({
    lists: []
  }),
  created () {
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
    async query (offset = 0) {
      var list = []
      await this.$fetch({
          method: 'GET',
          url: host + '/all-task/' + offset
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

<style scoped>
</style>
