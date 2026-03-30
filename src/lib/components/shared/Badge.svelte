<script lang="ts">
	type Variant = 'default' | 'valid' | 'warning' | 'error' | 'accent' | 'wins';

	let { variant = 'default', children }: { variant?: Variant; children: any } = $props();
</script>

<span class="badge badge--{variant}">
	{@render children()}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: 2px var(--space-2);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-2xs);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wider);
		line-height: var(--line-height-tight);
		white-space: nowrap;
		transition: var(--transition-colors);
	}

	.badge--default {
		background: var(--color-bg-hover);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border-subtle);
	}

	.badge--valid {
		background: var(--color-valid-bg);
		color: var(--color-valid);
		border: 1px solid var(--color-valid-border);
	}

	.badge--warning {
		background: var(--color-warning-bg);
		color: var(--color-warning);
		border: 1px solid var(--color-warning-border);
	}

	.badge--error {
		background: var(--color-error-bg);
		color: var(--color-error);
		border: 1px solid var(--color-error-border);
	}

	.badge--accent {
		background: var(--color-accent-bg);
		color: var(--color-accent);
		border: 1px solid var(--color-accent-border);
	}

	.badge--wins {
		background: var(--color-wins-bg);
		color: var(--color-wins);
		border: 1px solid rgba(34, 197, 94, 0.3);
	}
</style>
