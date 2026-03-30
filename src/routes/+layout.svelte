<script lang="ts">
	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/500.css';
	import '@fontsource/jetbrains-mono/600.css';
	import '@fontsource/jetbrains-mono/700.css';
	import '../app.css';
	import { PUBLIC_FATHOM_SITE_ID } from '$env/static/public';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	{#if PUBLIC_FATHOM_SITE_ID}
		<script
			src="https://cdn.usefathom.com/script.js"
			data-site={PUBLIC_FATHOM_SITE_ID}
			defer
		></script>
	{/if}
</svelte:head>

{@render children()}
