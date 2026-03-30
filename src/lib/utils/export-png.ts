import { toPng } from 'html-to-image';

export async function exportAsPng(element: HTMLElement) {
	// Temporarily reset transform for clean capture
	const originalTransform = element.style.transform;
	element.style.transform = 'none';

	try {
		const dataUrl = await toPng(element, {
			backgroundColor: '#08080d',
			pixelRatio: 2
		});

		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = 'usd-viz-export.png';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	} finally {
		element.style.transform = originalTransform;
	}
}
