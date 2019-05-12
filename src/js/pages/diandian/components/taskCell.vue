<template>
  <div>
    <div class="cell-content">
      <image class="cell-image" :src="item.detail.icon" />
      <div class="cell-center">
        <text class="cell-title">{{item.detail.appName}}</text>
        <text class="cell-sub-title">任务总数: {{item.count}}</text>
      </div>
      <div class="cell-right">
        <text v-if="item.status == 1" class="cell-right-status">任务进行中</text>
        <text v-if="item.status == 0" class="cell-right-status">任务已结束</text>
        <text class="cell-right-reward">佣金: {{item.reward}}元/份</text>
      </div>
    </div>
    <div class="cell-line"></div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    }
  },
  data: () => ({
  })
}
</script>

<style scoped>
  .cell-content {
    direction: ltr;
    flex-direction: row;
    margin-top: 20px;
    margin-bottom: 20px;
    align-items: stretch;
  }
  .cell-image {
    width: 130px;
    height: 130px;
    border-radius: 10px;
    overflow: hidden;
  }
  .cell-center {
    flex: 2;
    margin-left: 20px;
    justify-content: flex-start;
  }
  .cell-title {
    font-weight: bold;
    lines: 1;
    text-overflow: ellipsis;
    font-size: 36px;
  }
  .cell-sub-title {
    color: #999999;
    font-size: 28px;
    margin-top: 20px;
  }
  .cell-right {
    justify-content: space-between;
    font-size: 32px;
    align-items: flex-end;
  }
  .cell-right-status {
    font-weight: bold;
    font-size: 32px;
    color: #FE802B;
  }
  .cell-right-reward {
    font-size: 32px;
    color: #333333;
    padding-top: 60px;
  }
  .cell-line {
    height: 0.5px;
    background-color: #dddddd;
  }
</style>
