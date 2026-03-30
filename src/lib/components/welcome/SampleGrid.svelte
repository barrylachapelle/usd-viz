<script lang="ts">
	import SampleCard from './SampleCard.svelte';

	let { onfileload }: { onfileload: (name: string, content: string) => void } = $props();

	const samples = [
		{
			title: 'Shot Layout',
			description: 'Multi-layer shot with lighting, characters, and environment references',
			industry: 'VFX',
			filename: 'vfx-shot.usda'
		},
		{
			title: 'Game Level',
			description: 'Props and environment with LOD variant sets and material bindings',
			industry: 'Games',
			filename: 'game-level.usda'
		},
		{
			title: 'Building',
			description: 'Architectural scene with floors, rooms, walls, and material assignments',
			industry: 'Architecture',
			filename: 'arch-building.usda'
		},
		{
			title: 'Robot Arm',
			description: 'Articulated joint chain with custom attributes for joint limits',
			industry: 'Robotics',
			filename: 'robotics-arm.usda'
		}
	];

	async function loadSample(filename: string) {
		const response = await fetch(`/samples/${filename}`);
		const content = await response.text();
		onfileload(filename, content);
	}
</script>

<div class="sample-section">
	<p class="sample-section__label">or try a sample file</p>
	<div class="sample-grid">
		{#each samples as sample}
			<SampleCard
				title={sample.title}
				description={sample.description}
				industry={sample.industry}
				filename={sample.filename}
				onclick={() => loadSample(sample.filename)}
			/>
		{/each}
	</div>
</div>

<style>
	.sample-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		width: 100%;
	}

	.sample-section__label {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		text-align: center;
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wider);
	}

	.sample-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
	}

	@media (max-width: 640px) {
		.sample-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
