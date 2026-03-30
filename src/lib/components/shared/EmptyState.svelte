<script lang="ts">
	let { message }: { message: string } = $props();
</script>

<div class="empty-state">
	<p>{message}</p>
</div>

<style>
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-10);
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
		text-align: center;
	}
</style>
