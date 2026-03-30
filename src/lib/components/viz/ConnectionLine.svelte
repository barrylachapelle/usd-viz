<script lang="ts">
	let {
		x1,
		y1,
		x2,
		y2,
		isActive = false
	}: {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
		isActive?: boolean;
	} = $props();

	let midY = $derived((y1 + y2) / 2);
	let path = $derived(`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`);
</script>

<path
	d={path}
	class="connection-line"
	class:connection-line--active={isActive}
	fill="none"
	stroke-width="2"
/>

<style>
	.connection-line {
		stroke: var(--color-connection);
		transition: stroke var(--duration-normal) var(--ease-out);
	}

	.connection-line--active {
		stroke: var(--color-connection-active);
	}
</style>
