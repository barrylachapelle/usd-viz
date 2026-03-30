<script lang="ts">
	import Tag from '$lib/components/shared/Tag.svelte';
	import StatusDot from '$lib/components/shared/StatusDot.svelte';
	import type { UsdPrim } from '$lib/parser/types';

	let {
		prim,
		selectedId,
		depth = 0,
		onselect
	}: {
		prim: UsdPrim;
		selectedId: string | null;
		depth?: number;
		onselect: (id: string) => void;
	} = $props();

	let expanded = $state(true);
	let hasChildren = $derived(prim.children.length > 0);
	let isSelected = $derived(selectedId === prim.id);

	function toggle(e: MouseEvent) {
		e.stopPropagation();
		expanded = !expanded;
	}
</script>

<div class="tree-node">
	<button
		class="tree-node__row"
		class:tree-node__row--selected={isSelected}
		style="padding-left: {depth * 16 + 12}px;"
		onclick={() => onselect(prim.id)}
	>
		{#if hasChildren}
			<button class="tree-node__toggle" onclick={toggle} aria-label={expanded ? 'Collapse' : 'Expand'}>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none" class:tree-node__toggle--open={expanded}>
					<path d="M4 3L8 6L4 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		{:else}
			<span class="tree-node__spacer"></span>
		{/if}

		<StatusDot status={prim.status} />
		<span class="tree-node__name">{prim.name}</span>
		<span class="tree-node__type">{prim.typeName}</span>
	</button>

	{#if hasChildren && expanded}
		<div class="tree-node__children">
			{#each prim.children as child}
				<svelte:self prim={child} {selectedId} depth={depth + 1} {onselect} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.tree-node {
		display: flex;
		flex-direction: column;
	}

	.tree-node__row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-1) var(--space-3);
		padding-right: var(--space-4);
		min-height: 32px;
		text-align: left;
		width: 100%;
		border-radius: 0;
		transition: var(--transition-colors);
		cursor: pointer;
	}

	.tree-node__row:hover {
		background: var(--color-bg-hover);
	}

	.tree-node__row--selected {
		background: var(--color-accent-bg);
		border-right: 2px solid var(--color-accent);
	}

	.tree-node__row--selected:hover {
		background: var(--color-accent-bg);
	}

	.tree-node__toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		flex-shrink: 0;
		padding: 0;
		color: var(--color-text-muted);
		background: none;
		border: none;
		cursor: pointer;
		transition: var(--transition-transform);
	}

	.tree-node__toggle:hover {
		color: var(--color-text-primary);
	}

	.tree-node__toggle--open {
		transform: rotate(90deg);
	}

	.tree-node__spacer {
		width: 16px;
		flex-shrink: 0;
	}

	.tree-node__name {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tree-node__type {
		font-size: var(--font-size-2xs);
		color: var(--color-text-muted);
		white-space: nowrap;
		margin-left: auto;
		flex-shrink: 0;
	}

	.tree-node__children {
		display: flex;
		flex-direction: column;
	}
</style>
