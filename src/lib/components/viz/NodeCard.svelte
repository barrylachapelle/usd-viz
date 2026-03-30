<script lang="ts">
	import Tag from '$lib/components/shared/Tag.svelte';
	import Badge from '$lib/components/shared/Badge.svelte';
	import StatusDot from '$lib/components/shared/StatusDot.svelte';
	import type { UsdPrim } from '$lib/parser/types';

	let {
		prim,
		x,
		y,
		width,
		isSelected = false,
		onclick
	}: {
		prim: UsdPrim;
		x: number;
		y: number;
		width: number;
		isSelected?: boolean;
		onclick: () => void;
	} = $props();

	function getSpecTag(spec: string): string {
		if (spec === 'def') return 'root';
		if (spec === 'over') return 'sublayer';
		return 'reference';
	}
</script>

<button
	class="node-card"
	class:node-card--selected={isSelected}
	class:node-card--warning={prim.status === 'warning'}
	class:node-card--error={prim.status === 'error'}
	style="left: {x}px; top: {y}px; width: {width}px;"
	{onclick}
>
	<div class="node-card__header">
		<span class="node-card__type uppercase">{prim.typeName}</span>
		<StatusDot status={prim.status} />
	</div>

	<div class="node-card__name">{prim.name}</div>

	<div class="node-card__tags">
		<Tag variant={getSpecTag(prim.specifier)}>{prim.specifier}</Tag>

		{#if prim.references.length > 0}
			<Badge variant="accent">{prim.references.length} ref{prim.references.length !== 1 ? 's' : ''}</Badge>
		{/if}

		{#if prim.variantSets.length > 0}
			<Badge variant="default">{prim.variantSets.length} variant{prim.variantSets.length !== 1 ? 's' : ''}</Badge>
		{/if}

		{#if prim.issues.length > 0}
			<Badge variant="warning">issue</Badge>
		{/if}
	</div>

	<!-- Connection dots -->
	<span class="node-card__dot node-card__dot--in"></span>
	<span class="node-card__dot node-card__dot--out"></span>
</button>

<style>
	.node-card {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		background: var(--color-bg-surface);
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-lg);
		text-align: left;
		transition: var(--transition-all);
		cursor: pointer;
	}

	.node-card:hover {
		background: var(--color-bg-hover);
		border-color: var(--color-border-strong);
		box-shadow: var(--shadow-md);
		transform: translateY(-1px);
	}

	.node-card--selected {
		border-color: var(--color-accent);
		box-shadow: var(--shadow-glow-accent);
		background: var(--color-accent-bg);
	}

	.node-card--warning {
		border-color: var(--color-warning-border);
	}

	.node-card--error {
		border-color: var(--color-error-border);
	}

	.node-card__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.node-card__type {
		color: var(--color-text-muted);
	}

	.node-card__name {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.node-card__tags {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
		overflow: hidden;
		max-width: 100%;
	}

	.node-card__dot {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: var(--radius-full);
		background: var(--color-border-strong);
		border: 2px solid var(--color-bg-surface);
		transition: var(--transition-colors);
	}

	.node-card:hover .node-card__dot {
		background: var(--color-accent);
	}

	.node-card__dot--in {
		top: -5px;
		left: 50%;
		transform: translateX(-50%);
	}

	.node-card__dot--out {
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
