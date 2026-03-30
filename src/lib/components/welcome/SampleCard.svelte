<script lang="ts">
	let {
		title,
		description,
		industry,
		filename,
		onclick
	}: {
		title: string;
		description: string;
		industry: string;
		filename: string;
		onclick: () => void;
	} = $props();
</script>

<button class="sample-card" {onclick}>
	<div class="sample-card__industry">{industry}</div>
	<div class="sample-card__title">{title}</div>
	<div class="sample-card__description">{description}</div>
	<div class="sample-card__filename">{filename}</div>
</button>

<style>
	.sample-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-2);
		padding: var(--space-5);
		background: var(--color-bg-raised);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		text-align: left;
		width: 100%;
		transition: var(--transition-all);
	}

	.sample-card:hover {
		background: var(--color-bg-surface);
		border-color: var(--color-border-default);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	.sample-card:active {
		transform: translateY(0);
		box-shadow: var(--shadow-sm);
	}

	.sample-card__industry {
		font-size: var(--font-size-2xs);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wider);
		color: var(--color-accent);
	}

	.sample-card__title {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.sample-card__description {
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
	}

	.sample-card__filename {
		font-size: var(--font-size-2xs);
		color: var(--color-text-muted);
		margin-top: auto;
		padding-top: var(--space-2);
	}
</style>
