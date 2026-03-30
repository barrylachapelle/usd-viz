<script lang="ts">
	type Variant = 'default' | 'sublayer' | 'reference' | 'root' | 'payload';

	let { variant = 'default', children }: { variant?: Variant; children: any } = $props();
</script>

<span class="tag tag--{variant}">
	{@render children()}
</span>

<style>
	.tag {
		display: inline-flex;
		align-items: center;
		padding: 2px var(--space-2);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-2xs);
		font-weight: var(--font-weight-medium);
		letter-spacing: var(--letter-spacing-wide);
		line-height: var(--line-height-tight);
		white-space: nowrap;
		transition: var(--transition-colors);
	}

	.tag--default {
		background: var(--color-bg-hover);
		color: var(--color-text-secondary);
	}

	.tag--sublayer {
		background: var(--color-tag-bg);
		color: var(--color-tag);
	}

	.tag--reference {
		background: var(--color-accent-bg);
		color: var(--color-accent);
	}

	.tag--root {
		background: var(--color-valid-bg);
		color: var(--color-valid);
	}

	.tag--payload {
		background: var(--color-warning-bg);
		color: var(--color-warning);
	}
</style>
