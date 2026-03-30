<script lang="ts">
	let {
		onclick,
		title,
		disabled = false,
		children
	}: {
		onclick: () => void;
		title: string;
		disabled?: boolean;
		children: any;
	} = $props();
</script>

<button class="icon-button" {onclick} {title} {disabled} aria-label={title}>
	{@render children()}
</button>

<style>
	.icon-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-md);
		color: var(--color-text-secondary);
		background: transparent;
		transition: var(--transition-all);
	}

	.icon-button:hover:not(:disabled) {
		background: var(--color-bg-hover);
		color: var(--color-text-primary);
	}

	.icon-button:active:not(:disabled) {
		background: var(--color-bg-active);
		transform: scale(0.95);
	}

	.icon-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
