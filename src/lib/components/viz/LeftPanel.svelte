<script lang="ts">
	import TreeNode from './TreeNode.svelte';
	import { getParsedData, getSelectedNodeId } from '$lib/stores/app.svelte';

	let { onnodeselect }: { onnodeselect: (id: string) => void } = $props();
</script>

<aside class="left-panel">
	<div class="left-panel__header uppercase">
		Scene Outline
	</div>

	<div class="left-panel__tree">
		{#each getParsedData()?.rootPrims ?? [] as prim}
			<TreeNode
				{prim}
				selectedId={getSelectedNodeId()}
				onselect={onnodeselect}
			/>
		{/each}
	</div>
</aside>

<style>
	.left-panel {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--color-bg-base);
		border-right: 1px solid var(--color-border-subtle);
		overflow: hidden;
	}

	.left-panel__header {
		padding: var(--space-4) var(--space-5);
		color: var(--color-text-muted);
		border-bottom: 1px solid var(--color-border-subtle);
		flex-shrink: 0;
	}

	.left-panel__tree {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-2) 0;
	}
</style>
