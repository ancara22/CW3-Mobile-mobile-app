<!-- Component templeate -->
<template>
	<div id="app">
		<ParentComponent/>
	</div>
</template>

<!-- Script -->
<script>
import ParentComponent from './components/ParentComponent.vue'

export default {
	name: 'App',
	components: {
		ParentComponent
	},
	head: {
       link: [
             {
                 rel: "icon",
                 href: require("./assets/logo.png")
             },
          ]
       }
}
</script>

<!-- Styles -->
<style>
#app {
	text-align: center;
	color: #2c3e50;
}
</style>
