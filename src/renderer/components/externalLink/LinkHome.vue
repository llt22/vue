<template>
  <div class="link-home">
    <div id="iframe-container">
      <iframe :src="link" scrolling="auto" frameborder="0" id="iframe"></iframe>
    </div>
  </div>
</template>

<script>
//import NProgress from 'nprogress'

export default {
	data() {
	    return {
	        title: this.$route.params.title,
			link:"http://192.168.75.87:8080/webroot/decision/view/report?viewlet=PPM_CLOUD/business/作业公司营收分析V1.0.frm"
	    }
	 },
  mounted() {
		let iframe = document.getElementById('iframe')
	},
  methods: {
  }
}
</script>
