import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export async function exportAsPdf(element: HTMLElement) {
	// Temporarily reset transform for clean capture
	const originalTransform = element.style.transform;
	element.style.transform = 'none';

	try {
		const dataUrl = await toPng(element, {
			backgroundColor: '#08080d',
			pixelRatio: 2
		});

		const img = new Image();
		img.src = dataUrl;

		await new Promise<void>((resolve) => {
			img.onload = () => resolve();
		});

		const pdf = new jsPDF({
			orientation: img.width > img.height ? 'landscape' : 'portrait',
			unit: 'px',
			format: [img.width / 2, img.height / 2]
		});

		pdf.addImage(dataUrl, 'PNG', 0, 0, img.width / 2, img.height / 2);
		pdf.save('usd-viz-export.pdf');
	} finally {
		element.style.transform = originalTransform;
	}
}
