import type { ParsedUsdFile } from '$lib/parser/types';

export function exportAsJson(data: ParsedUsdFile) {
	const json = JSON.stringify(data, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'usd-viz-export.json';
	a.click();
	URL.revokeObjectURL(url);
}
