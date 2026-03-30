<script lang="ts">
	type Status = 'valid' | 'warning' | 'error' | 'neutral';

	let { status = 'neutral' }: { status?: Status } = $props();
</script>

<span class="dot dot--{status}" aria-label="{status}"></span>

<style>
	.dot {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: var(--radius-full);
		flex-shrink: 0;
		transition: var(--transition-colors);
	}

	.dot--valid {
		background: var(--color-valid);
		box-shadow: var(--shadow-glow-green);
	}

	.dot--warning {
		background: var(--color-warning);
		box-shadow: var(--shadow-glow-amber);
	}

	.dot--error {
		background: var(--color-error);
	}

	.dot--neutral {
		background: var(--color-text-muted);
	}
</style>
