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

	created() {
		//Register the  service worker
		if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('./custom-service-worker.js')
			.then(registration => {
				console.log('Custom Service Worker registered with scope:', registration.scope);
			}).catch(error => {
				console.error('Error registering Custom Service Worker:', error);
			});
		}
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
