<script lang="ts">
	import Badge from '$lib/components/shared/Badge.svelte';
	import {
		getFileName,
		getWarningCount,
		getErrorCount,
		resetToWelcome
	} from '$lib/stores/app.svelte';
</script>

<header class="header">
	<div class="header__left">
		<button class="header__logo" onclick={resetToWelcome} title="Back to welcome">
			usd-viz
		</button>
		<span class="header__divider"></span>
		<span class="header__filename">{getFileName()}</span>
	</div>

	<div class="header__right">
		{#if getWarningCount() > 0 || getErrorCount() > 0}
			<div class="header__status">
				{#if getWarningCount() > 0}
					<Badge variant="warning">{getWarningCount()} warning{getWarningCount() !== 1 ? 's' : ''}</Badge>
				{/if}
				{#if getErrorCount() > 0}
					<Badge variant="error">{getErrorCount()} error{getErrorCount() !== 1 ? 's' : ''}</Badge>
				{/if}
			</div>
		{:else}
			<Badge variant="valid">0 issues</Badge>
		{/if}
	</div>
</header>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: var(--header-height);
		padding: 0 var(--space-5);
		background: var(--color-bg-base);
		border-bottom: 1px solid var(--color-border-subtle);
		z-index: var(--z-raised);
		position: relative;
	}

	.header__left {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.header__logo {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-bold);
		color: var(--color-text-primary);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-md);
	}

	.header__logo:hover {
		background: var(--color-bg-hover);
		color: var(--color-accent);
	}

	.header__divider {
		width: 1px;
		height: 20px;
		background: var(--color-border-default);
	}

	.header__filename {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		padding: var(--space-1) var(--space-3);
		background: var(--color-bg-raised);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border-subtle);
	}

	.header__right {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.header__status {
		display: flex;
		gap: var(--space-2);
	}
</style>
