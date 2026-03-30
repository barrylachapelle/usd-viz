<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import WelcomeScreen from '$lib/components/welcome/WelcomeScreen.svelte';
	import VizScreen from '$lib/components/viz/VizScreen.svelte';
	import { getScreen, loadFile } from '$lib/stores/app.svelte';

	function handleFileLoad(name: string, content: string) {
		loadFile(name, content);
	}
</script>

<div class="app">
	{#if getScreen() === 'welcome'}
		<div class="screen" in:fade={{ duration: 300, delay: 100 }} out:fade={{ duration: 200 }}>
			<WelcomeScreen onfileload={handleFileLoad} />
		</div>
	{:else}
		<div class="screen" in:fly={{ y: 20, duration: 350, delay: 100 }} out:fade={{ duration: 200 }}>
			<VizScreen />
		</div>
	{/if}
</div>

<style>
	.app {
		height: 100vh;
		overflow: hidden;
	}

	.screen {
		height: 100%;
	}
</style>
