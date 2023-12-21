<template>
	<div id="app">
		<ParentComponent/>
	</div>
</template>

<script>
	import ParentComponent from './components/ParentComponent.vue'

	export default {
		name: 'App',
		components: {
			ParentComponent
		}
	}
</script>

<style>
	#app {
		text-align: center;
		color: #2c3e50;
	}
</style>
