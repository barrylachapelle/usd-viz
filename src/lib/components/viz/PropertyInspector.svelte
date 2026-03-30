<script lang="ts">
	import Badge from '$lib/components/shared/Badge.svelte';
	import type { UsdPrim } from '$lib/parser/types';

	let { prim }: { prim: UsdPrim } = $props();
</script>

<div class="inspector">
	<div class="inspector__section">
		<div class="inspector__section-header uppercase">
			Inspector · {prim.path}
		</div>

		<div class="inspector__prim-info">
			<div class="inspector__prim-name">{prim.name}</div>
			<div class="inspector__prim-meta text-secondary">
				{prim.specifier} {prim.typeName} · {prim.children.length} children
			</div>
		</div>
	</div>

	{#if prim.properties.length > 0}
		<div class="inspector__section">
			<div class="inspector__section-title uppercase">Properties</div>
			<div class="inspector__properties">
				{#each prim.properties as prop}
					<div class="inspector__property">
						<div class="inspector__prop-header">
							<span class="inspector__prop-name">{prop.name}</span>
							<span class="inspector__prop-type text-muted">{prop.typeName}</span>
						</div>
						<div class="inspector__prop-value">
							{prop.value}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if prim.references.length > 0}
		<div class="inspector__section">
			<div class="inspector__section-title uppercase">References</div>
			{#each prim.references as ref}
				<div class="inspector__ref">
					<span class="inspector__ref-path">{ref}</span>
				</div>
			{/each}
		</div>
	{/if}

	{#if prim.variantSets.length > 0}
		<div class="inspector__section">
			<div class="inspector__section-title uppercase">Variant Sets</div>
			{#each prim.variantSets as vs}
				<div class="inspector__variant-set">
					<div class="inspector__variant-name">{vs.name}</div>
					<div class="inspector__variant-list">
						{#each vs.variants as variant}
							<Badge variant="default">{variant}</Badge>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	{#if prim.issues.length > 0}
		<div class="inspector__section">
			<div class="inspector__section-title uppercase">Issues</div>
			{#each prim.issues as issue}
				<div class="inspector__issue">
					<div class="inspector__issue-label uppercase">Warning</div>
					<p>{issue}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.inspector {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.inspector__section {
		padding: var(--space-4) var(--space-5);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.inspector__section-header {
		color: var(--color-text-muted);
		margin-bottom: var(--space-3);
	}

	.inspector__section-title {
		color: var(--color-text-muted);
		margin-bottom: var(--space-3);
	}

	.inspector__prim-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.inspector__prim-name {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-bold);
	}

	.inspector__prim-meta {
		font-size: var(--font-size-xs);
	}

	.inspector__properties {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.inspector__property {
		padding: var(--space-3);
		background: var(--color-bg-raised);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
	}

	.inspector__prop-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-1);
	}

	.inspector__prop-name {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-accent);
	}

	.inspector__prop-type {
		font-size: var(--font-size-2xs);
	}

	.inspector__prop-value {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		word-break: break-all;
	}

	.inspector__ref {
		padding: var(--space-2) var(--space-3);
		background: var(--color-accent-bg);
		border: 1px solid var(--color-accent-border);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-2);
	}

	.inspector__ref-path {
		font-size: var(--font-size-sm);
		color: var(--color-accent);
	}

	.inspector__variant-set {
		margin-bottom: var(--space-3);
	}

	.inspector__variant-name {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		margin-bottom: var(--space-2);
	}

	.inspector__variant-list {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.inspector__issue {
		padding: var(--space-3);
		background: var(--color-warning-bg);
		border: 1px solid var(--color-warning-border);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-2);
	}

	.inspector__issue-label {
		color: var(--color-warning);
		margin-bottom: var(--space-1);
	}

	.inspector__issue p {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}
</style>
