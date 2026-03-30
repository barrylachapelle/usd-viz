<script lang="ts">
	import Tag from '$lib/components/shared/Tag.svelte';
	import StatusDot from '$lib/components/shared/StatusDot.svelte';
	import Badge from '$lib/components/shared/Badge.svelte';
	import type { LayerInfo } from '$lib/parser/types';

	let {
		layer,
		strengthLabel,
		onclick
	}: {
		layer: LayerInfo;
		strengthLabel: string;
		onclick: () => void;
	} = $props();
</script>

<button class="layer-item" {onclick}>
	<div class="layer-item__header">
		<span class="layer-item__strength uppercase">{strengthLabel}</span>
		<span class="layer-item__bar" class:layer-item__bar--root={layer.type === 'root'}></span>
	</div>
	<div class="layer-item__filename">{layer.filename}</div>
	<div class="layer-item__tags">
		<Tag variant={layer.type === 'root' ? 'root' : layer.type === 'sublayer' ? 'sublayer' : layer.type === 'reference' ? 'reference' : 'payload'}>
			{layer.type}
		</Tag>
		{#if layer.status === 'valid'}
			<Badge variant="valid">valid</Badge>
		{:else if layer.status === 'warning'}
			<Badge variant="warning">
				{layer.issues[0] || 'warning'}
			</Badge>
		{:else}
			<Badge variant="error">error</Badge>
		{/if}
	</div>
</button>

<style>
	.layer-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		background: transparent;
		border-left: 2px solid var(--color-border-subtle);
		text-align: left;
		width: 100%;
		border-radius: 0;
		transition: var(--transition-all);
	}

	.layer-item:hover {
		background: var(--color-bg-hover);
		border-left-color: var(--color-accent);
	}

	.layer-item__header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.layer-item__strength {
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	.layer-item__bar {
		flex: 1;
		height: 2px;
		background: var(--color-border-subtle);
		border-radius: var(--radius-full);
	}

	.layer-item__bar--root {
		background: var(--color-valid);
	}

	.layer-item__filename {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.layer-item__tags {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
</style>
