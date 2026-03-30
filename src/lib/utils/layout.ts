import type { UsdPrim, LayoutNode } from '$lib/parser/types';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 90;
const VERTICAL_GAP = 50;
const HORIZONTAL_GAP = 40;

export interface LayoutResult {
	nodes: LayoutNode[];
	connections: Array<{ fromId: string; toId: string }>;
	totalWidth: number;
	totalHeight: number;
}

export function layoutGraph(rootPrims: UsdPrim[]): LayoutResult {
	const nodes: LayoutNode[] = [];
	const connections: Array<{ fromId: string; toId: string }> = [];

	// First pass: calculate subtree widths
	function getSubtreeWidth(prim: UsdPrim): number {
		if (prim.children.length === 0) {
			return NODE_WIDTH;
		}
		const childrenWidth = prim.children.reduce(
			(sum, child) => sum + getSubtreeWidth(child) + HORIZONTAL_GAP,
			-HORIZONTAL_GAP
		);
		return Math.max(NODE_WIDTH, childrenWidth);
	}

	// Second pass: position nodes
	function positionPrim(
		prim: UsdPrim,
		x: number,
		y: number,
		availableWidth: number,
		parentId: string | null
	) {
		const nodeX = x + (availableWidth - NODE_WIDTH) / 2;

		nodes.push({
			id: prim.id,
			x: nodeX,
			y,
			width: NODE_WIDTH,
			height: NODE_HEIGHT,
			prim,
			parentId
		});

		if (parentId) {
			connections.push({ fromId: parentId, toId: prim.id });
		}

		if (prim.children.length > 0) {
			const childY = y + NODE_HEIGHT + VERTICAL_GAP;
			const totalChildrenWidth = prim.children.reduce(
				(sum, child) => sum + getSubtreeWidth(child) + HORIZONTAL_GAP,
				-HORIZONTAL_GAP
			);
			let childX = x + (availableWidth - totalChildrenWidth) / 2;

			for (const child of prim.children) {
				const childWidth = getSubtreeWidth(child);
				positionPrim(child, childX, childY, childWidth, prim.id);
				childX += childWidth + HORIZONTAL_GAP;
			}
		}
	}

	// Layout all root prims
	const totalRootWidth = rootPrims.reduce(
		(sum, prim) => sum + getSubtreeWidth(prim) + HORIZONTAL_GAP * 2,
		0
	);

	let currentX = HORIZONTAL_GAP;
	for (const prim of rootPrims) {
		const subtreeWidth = getSubtreeWidth(prim);
		positionPrim(prim, currentX, VERTICAL_GAP, subtreeWidth, null);
		currentX += subtreeWidth + HORIZONTAL_GAP * 2;
	}

	// Calculate total dimensions
	let maxX = 0;
	let maxY = 0;
	for (const node of nodes) {
		maxX = Math.max(maxX, node.x + node.width);
		maxY = Math.max(maxY, node.y + node.height);
	}

	return {
		nodes,
		connections,
		totalWidth: maxX + HORIZONTAL_GAP * 2,
		totalHeight: maxY + VERTICAL_GAP * 2
	};
}

export function getNodeCenter(node: LayoutNode): { x: number; y: number } {
	return {
		x: node.x + node.width / 2,
		y: node.y + node.height / 2
	};
}

export function getNodeTop(node: LayoutNode): { x: number; y: number } {
	return {
		x: node.x + node.width / 2,
		y: node.y
	};
}

export function getNodeBottom(node: LayoutNode): { x: number; y: number } {
	return {
		x: node.x + node.width / 2,
		y: node.y + node.height
	};
}
