<script lang="ts">
	import DropZone from './DropZone.svelte';
	import SampleGrid from './SampleGrid.svelte';

	let { onfileload }: { onfileload: (name: string, content: string) => void } = $props();
</script>

<div class="welcome">
	<div class="welcome__container">
		<header class="welcome__header">
			<h1 class="welcome__title">usd-viz</h1>
			<p class="welcome__subtitle">
				Visualize USD scene graphs as interactive node trees.
				<br />
				Explore layers, inspect properties, and spot issues — instantly.
			</p>
			<p class="welcome__privacy">
				<span class="welcome__privacy-dot"></span>
				100% client-side — your files never leave your browser
			</p>
		</header>

		<DropZone {onfileload} />

		<SampleGrid {onfileload} />

		<footer class="welcome__footer">
			<p>
				Open source & free forever.
				<a href="https://github.com/barrylachapelle/usd-viz" target="_blank" rel="noopener">
					GitHub
				</a>
			</p>
		</footer>
	</div>
</div>

<style>
	.welcome {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: var(--space-8);
	}

	.welcome__container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-10);
		max-width: 640px;
		width: 100%;
	}

	.welcome__header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		text-align: center;
	}

	.welcome__title {
		font-size: var(--font-size-4xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-text-primary);
		letter-spacing: var(--letter-spacing-tight);
		line-height: var(--line-height-tight);
	}

	.welcome__subtitle {
		font-size: var(--font-size-base);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
		max-width: 480px;
	}

	.welcome__privacy {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-valid-bg);
		border: 1px solid var(--color-valid-border);
		border-radius: var(--radius-full);
		font-size: var(--font-size-xs);
		color: var(--color-valid);
	}

	.welcome__privacy-dot {
		width: 6px;
		height: 6px;
		border-radius: var(--radius-full);
		background: var(--color-valid);
		box-shadow: var(--shadow-glow-green);
		flex-shrink: 0;
	}

	.welcome__footer {
		color: var(--color-text-muted);
		font-size: var(--font-size-xs);
	}

	.welcome__footer a {
		color: var(--color-text-secondary);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.welcome__footer a:hover {
		color: var(--color-text-primary);
	}
</style>
