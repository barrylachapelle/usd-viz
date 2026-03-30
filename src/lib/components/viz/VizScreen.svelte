<script lang="ts">
	import HeaderBar from './HeaderBar.svelte';
	import LeftPanel from './LeftPanel.svelte';
	import CenterPanel from './CenterPanel.svelte';
	import RightPanel from './RightPanel.svelte';
	import { selectNode } from '$lib/stores/app.svelte';

	let centerPanel: CenterPanel;

	function handleNodeSelect(id: string) {
		selectNode(id);
		centerPanel?.scrollToNode(id);
	}
</script>

<div class="viz-screen">
	<HeaderBar />

	<div class="viz-screen__panels">
		<LeftPanel onnodeselect={handleNodeSelect} />
		<CenterPanel bind:this={centerPanel} />
		<RightPanel />
	</div>
</div>

<style>
	.viz-screen {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.viz-screen__panels {
		display: grid;
		grid-template-columns: var(--left-panel-width) 1fr var(--right-panel-width);
		flex: 1;
		overflow: hidden;
	}
</style>
