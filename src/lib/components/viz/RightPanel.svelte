<script lang="ts">
	import PropertyInspector from './PropertyInspector.svelte';
	import { getSelectedNode } from '$lib/stores/app.svelte';
</script>

<aside class="right-panel">
	{#if getSelectedNode()}
		<PropertyInspector prim={getSelectedNode()!} />
	{:else}
		<div class="right-panel__empty">
			<p>click any node to inspect properties</p>
		</div>
	{/if}
</aside>

<style>
	.right-panel {
		height: 100%;
		background: var(--color-bg-base);
		border-left: 1px solid var(--color-border-subtle);
		overflow-y: auto;
	}

	.right-panel__empty {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}
</style>
