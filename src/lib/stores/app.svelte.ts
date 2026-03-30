import { parseUsdaFile } from '$lib/parser/usda-parser';
import type { ParsedUsdFile, UsdPrim } from '$lib/parser/types';

type Screen = 'welcome' | 'viz';

let currentScreen = $state<Screen>('welcome');
let loadedFileName = $state<string | null>(null);
let parsedData = $state<ParsedUsdFile | null>(null);
let selectedNodeId = $state<string | null>(null);

export function getScreen() {
	return currentScreen;
}

export function getFileName() {
	return loadedFileName;
}

export function getParsedData() {
	return parsedData;
}

export function getSelectedNodeId() {
	return selectedNodeId;
}

export function getSelectedNode(): UsdPrim | null {
	if (!parsedData || !selectedNodeId) return null;

	function findNode(prims: UsdPrim[]): UsdPrim | null {
		for (const prim of prims) {
			if (prim.id === selectedNodeId) return prim;
			const found = findNode(prim.children);
			if (found) return found;
		}
		return null;
	}

	return findNode(parsedData.rootPrims);
}

export function getWarningCount(): number {
	if (!parsedData) return 0;
	return parsedData.warnings.filter((w) => w.severity === 'warning').length;
}

export function getErrorCount(): number {
	if (!parsedData) return 0;
	return parsedData.warnings.filter((w) => w.severity === 'error').length;
}

export function loadFile(name: string, content: string) {
	const parsed = parseUsdaFile(name, content);
	parsedData = parsed;
	loadedFileName = name;
	selectedNodeId = null;
	currentScreen = 'viz';
}

export function selectNode(id: string | null) {
	selectedNodeId = id;
}

export function resetToWelcome() {
	currentScreen = 'welcome';
	loadedFileName = null;
	parsedData = null;
	selectedNodeId = null;
}
