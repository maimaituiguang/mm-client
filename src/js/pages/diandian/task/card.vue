<template>
  <div class="card-container">
    <div class="card" style="background-color: #746AFE;">
      <text class="card-icon">&#xe7a3; 人气</text>
      <text class="card-number">{{hotCount}}</text>
    </div>
    <div class="card" style="background-color: #FE802B;">
      <text class="card-icon">&#xe60d; 已发布</text>
      <text class="card-number">{{published}}</text>
    </div>
    <div class="card" style="background-color: #8BC8FF;">
      <text class="card-icon">&#xe66e; 已完成</text>
      <text class="card-number">{{finished}}</text>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hotCount: {
      type: Number,
      default: 75939
    },
    published: {
      type: Number,
      default: 9364
    },
    finished: {
      type: Number,
      default: 65344
    }
  }
}
</script>

<style scoped>
  .card-container {
    flex-direction: row;
    justify-content: space-between;
  }
  .card {
    width: 200px;
    height: 140px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
  }
  .card-icon {
    font-family: qimaiIconfont;
    color: white;
    font-size: 32px;
    align-self: flex-start;
    margin-left: 20px;
  }
  .card-number {
    color: white;
    font-size: 36px;
    font-weight: bold;
  }
</style>
