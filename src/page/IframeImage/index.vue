<template>
  <div class="cell-result-page">
    <iframe
      class="result-html"
      ref="htmlDom"
      sandbox="allow-scripts"
      style="width: 100%; height: 100%;"
      :srcDoc="detailContent"
      frameBorder="0"
      scrolling="yes"
      v-if="detailType === 'html'"
    />
    <img v-else ref="jobImage" id="jobImage" :src="`data:image/png;base64,${detailContent}`" alt="">
  </div>
</template>
<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { mapActions } from 'vuex'

@Component({
  methods: {
    ...mapActions({
      getJobStatus: 'GET_JOB_STATUS'
    })
  }
})
export default class IframePage extends Vue {
  excuteResult = ''
  detailType = 'html'
  detailContent = ''

  created () {
    this.getStatus(this.$route.params.id)
  }
  
  async getStatus (id) {
    if (!id) {
      return
    }
    try {
      const res = await this.getJobStatus(id)
      const { status, result } = res.data
      if (status === '1') {
        let parsedResult =result && result ? JSON.parse(result) : ''
        const length = parsedResult.length
        this.detailType = 'table'
        if (length === 1) {
          const details = parsedResult[0]
          if (Object.prototype.hasOwnProperty.call(details, 'mime') && Object.prototype.hasOwnProperty.call(details, 'content')) {
            this.detailType = details.mime
            this.detailContent = details.content
          }
        } 
      }
    } catch (err) {
      console.log(err)
    }
  }
}
</script>
<style lang="scss">
@import '../../assets/css/variable.scss';
.cell-result-page {
  width: 100%;
  height: calc(100vh - $page-header-height);
  .result-html {
    margin: 0 auto;
  }
  img {
    max-width: 100%;
  }
}
</style>