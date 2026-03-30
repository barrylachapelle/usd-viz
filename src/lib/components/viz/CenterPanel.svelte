<script lang="ts">
	import { tick } from 'svelte';
	import NodeCard from './NodeCard.svelte';
	import ConnectionLine from './ConnectionLine.svelte';
	import { getParsedData, getSelectedNodeId, selectNode } from '$lib/stores/app.svelte';
	import { layoutGraph, getNodeBottom, getNodeTop } from '$lib/utils/layout';
	import type { LayoutNode } from '$lib/parser/types';

	let containerEl: HTMLDivElement;
	let canvasEl: HTMLDivElement;

	let scale = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let isPanning = $state(false);
	let isAnimating = $state(false);
	let panStartX = 0;
	let panStartY = 0;
	let panStartPanX = 0;
	let panStartPanY = 0;

	const MIN_ZOOM = 0.15;
	const MAX_ZOOM = 2;
	const ZOOM_STEP = 0.1;
	const FIT_PADDING = 60;
	const DRAG_THRESHOLD = 4;

	let layout = $derived(getParsedData() ? layoutGraph(getParsedData()!.rootPrims) : null);

	function getConnectionPoints(fromId: string, toId: string) {
		if (!layout) return null;
		const fromNode = layout.nodes.find((n) => n.id === fromId);
		const toNode = layout.nodes.find((n) => n.id === toId);
		if (!fromNode || !toNode) return null;
		const from = getNodeBottom(fromNode);
		const to = getNodeTop(toNode);
		return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
	}

	function isConnectionActive(fromId: string, toId: string): boolean {
		const selected = getSelectedNodeId();
		return selected === fromId || selected === toId;
	}

	function fitToView() {
		if (!layout || !containerEl || layout.nodes.length === 0) return;

		const rect = containerEl.getBoundingClientRect();
		const viewW = rect.width - FIT_PADDING * 2;
		const viewH = rect.height - FIT_PADDING * 2;

		if (viewW <= 0 || viewH <= 0) return;

		const contentW = layout.totalWidth;
		const contentH = layout.totalHeight;

		const fitScale = Math.min(viewW / contentW, viewH / contentH, 1);
		scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, fitScale));

		panX = (rect.width - contentW * scale) / 2;
		panY = (rect.height - contentH * scale) / 2;
	}

	// Auto-fit when layout changes
	$effect(() => {
		if (layout && containerEl) {
			tick().then(() => fitToView());
		}
	});

	function onwheel(e: WheelEvent) {
		e.preventDefault();
		const rect = containerEl.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const prevScale = scale;
		const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
		scale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale + delta));

		const scaleChange = scale / prevScale;
		panX = mouseX - (mouseX - panX) * scaleChange;
		panY = mouseY - (mouseY - panY) * scaleChange;
	}

	function onmousedown(e: MouseEvent) {
		if (e.button !== 0 && e.button !== 1) return;

		panStartX = e.clientX;
		panStartY = e.clientY;
		panStartPanX = panX;
		panStartPanY = panY;

		// Add listeners to window so we track even outside the panel
		window.addEventListener('mousemove', onmousemove);
		window.addEventListener('mouseup', onmouseup);
	}

	function onmousemove(e: MouseEvent) {
		const dx = e.clientX - panStartX;
		const dy = e.clientY - panStartY;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (!isPanning && dist >= DRAG_THRESHOLD) {
			isPanning = true;
		}

		if (isPanning) {
			panX = panStartPanX + dx;
			panY = panStartPanY + dy;
		}
	}

	function onmouseup() {
		isPanning = false;
		window.removeEventListener('mousemove', onmousemove);
		window.removeEventListener('mouseup', onmouseup);
	}

	function zoomIn() {
		const rect = containerEl.getBoundingClientRect();
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		const prevScale = scale;
		scale = Math.min(MAX_ZOOM, scale + ZOOM_STEP);
		const scaleChange = scale / prevScale;
		panX = cx - (cx - panX) * scaleChange;
		panY = cy - (cy - panY) * scaleChange;
	}

	function zoomOut() {
		const rect = containerEl.getBoundingClientRect();
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		const prevScale = scale;
		scale = Math.max(MIN_ZOOM, scale - ZOOM_STEP);
		const scaleChange = scale / prevScale;
		panX = cx - (cx - panX) * scaleChange;
		panY = cy - (cy - panY) * scaleChange;
	}

	function zoomReset() {
		fitToView();
	}

	let zoomPercent = $derived(Math.round(scale * 100));

	// Export helper: returns the canvas element with transform reset for clean capture
	export function getCanvasForExport(): HTMLElement | null {
		return canvasEl ?? null;
	}

	export function getExportTransform(): { scale: number; panX: number; panY: number } {
		return { scale, panX, panY };
	}

	export function scrollToNode(nodeId: string) {
		if (!layout || !containerEl) return;
		const node = layout.nodes.find((n) => n.id === nodeId);
		if (!node) return;
		const rect = containerEl.getBoundingClientRect();

		// Animate the transition
		isAnimating = true;

		// Zoom in so the node is prominent but you still see context
		scale = Math.max(0.8, Math.min(MAX_ZOOM, 0.8));

		panX = rect.width / 2 - (node.x + node.width / 2) * scale;
		panY = rect.height / 2 - (node.y + node.height / 2) * scale;

		setTimeout(() => { isAnimating = false; }, 400);
	}

	export function scrollToLayerIndex(index: number) {
		if (!layout) return;
		const node = layout.nodes[0];
		if (node) scrollToNode(node.id);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="center-panel"
	class:center-panel--panning={isPanning}
	bind:this={containerEl}
	{onwheel}
	{onmousedown}
>
	{#if layout}
		<div
			class="center-panel__canvas"
			class:center-panel__canvas--animating={isAnimating}
			bind:this={canvasEl}
			style="transform: translate({panX}px, {panY}px) scale({scale}); transform-origin: 0 0; width: {layout.totalWidth}px; height: {layout.totalHeight}px;"
		>
			<!-- Connection lines -->
			<svg
				class="center-panel__connections"
				width={layout.totalWidth}
				height={layout.totalHeight}
			>
				{#each layout.connections as conn}
					{@const points = getConnectionPoints(conn.fromId, conn.toId)}
					{#if points}
						<ConnectionLine
							x1={points.x1}
							y1={points.y1}
							x2={points.x2}
							y2={points.y2}
							isActive={isConnectionActive(conn.fromId, conn.toId)}
						/>
					{/if}
				{/each}
			</svg>

			<!-- Node cards -->
			{#each layout.nodes as node}
				<NodeCard
					prim={node.prim}
					x={node.x}
					y={node.y}
					width={node.width}
					isSelected={getSelectedNodeId() === node.id}
					onclick={() => selectNode(node.id)}
				/>
			{/each}
		</div>
	{/if}

	{#if !layout || layout.nodes.length === 0}
		<div class="center-panel__empty">
			<p>No prims found in this file</p>
		</div>
	{/if}

	<!-- Zoom controls -->
	<div class="zoom-controls">
		<button class="zoom-btn" onclick={zoomOut} title="Zoom out">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M4 8H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
		</button>
		<button class="zoom-level" onclick={zoomReset} title="Fit to view">
			{zoomPercent}%
		</button>
		<button class="zoom-btn" onclick={zoomIn} title="Zoom in">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M8 4V12M4 8H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
		</button>
	</div>
</div>

<style>
	.center-panel {
		position: relative;
		height: 100%;
		overflow: hidden;
		background:
			radial-gradient(circle at 1px 1px, var(--color-border-subtle) 1px, transparent 0) 0 0 /
			24px 24px;
		cursor: grab;
	}

	.center-panel--panning {
		cursor: grabbing;
		user-select: none;
	}

	.center-panel__canvas {
		position: absolute;
		will-change: transform;
	}

	.center-panel__canvas--animating {
		transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.center-panel__connections {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
	}

	.center-panel__empty {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	/* Zoom controls */
	.zoom-controls {
		position: absolute;
		bottom: var(--space-5);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0;
		background: var(--color-bg-surface);
		border: 1px solid var(--color-border-default);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		overflow: hidden;
		z-index: var(--z-raised);
	}

	.zoom-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		color: var(--color-text-secondary);
		background: transparent;
		transition: var(--transition-all);
	}

	.zoom-btn:hover {
		background: var(--color-bg-hover);
		color: var(--color-text-primary);
	}

	.zoom-btn:active {
		background: var(--color-bg-active);
		transform: scale(0.95);
	}

	.zoom-level {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 56px;
		height: 36px;
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		background: transparent;
		border-left: 1px solid var(--color-border-subtle);
		border-right: 1px solid var(--color-border-subtle);
		transition: var(--transition-colors);
	}

	.zoom-level:hover {
		color: var(--color-text-primary);
		background: var(--color-bg-hover);
	}
</style>
