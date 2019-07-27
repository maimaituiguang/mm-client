<template>
  <div>
    <slider class="slider size" auto-play="true" interval="3000">
      <div v-for="url in urls" :key="url">
        <image class="size" resize="cover" @load="onLoad" :src="url"></image>
      </div>
      <indicator class="slider-indicator"></indicator>
    </slider>
    <div class="loading-wrapper" v-if="loading">
      <image class="loading" resize="cover" src="https://img.alicdn.com/tfs/TB1CWnby7yWBuNjy0FpXXassXXa-32-32.gif" ></image>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    urls: [],
    loading: true
  }),
  created: function () {
    const stream = weex.requireModule('stream') || {}
    const modal = weex.requireModule('modal') || {}

    this.$fetch({
      method: 'GET',
      name: 'task.banner'
    }).then(resData => {
      this.urls = resData.data
    }, error => {})
  },
  methods: {
    onLoad: function (e) {
      if (e.success && this.loading) {
        this.loading = false
      }
    }
  }
}

</script>

<style scoped>
  .loading-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #fff;
    /* justify-content: center; */
    align-items: center;
  }
  .loading {
    width: 60px;
    height: 60px;
    margin-top: 200px;
  }
  .size {
    width: 750px;
    height: 400px;
  }
  .slider {
    position: relative;
  }
  .slider-indicator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;
    background-color: rgba(0, 0, 0, 0);
    item-color: #ddd;
    item-selected-color: rgb(0, 180, 255);
  }
</style>
