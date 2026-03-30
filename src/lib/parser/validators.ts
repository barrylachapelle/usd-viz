export interface ValidationResult {
	valid: boolean;
	message?: string;
}

export function validateFileExtension(filename: string): ValidationResult {
	const lower = filename.toLowerCase();

	if (lower.endsWith('.usda')) {
		return { valid: true };
	}

	if (lower.endsWith('.usdc')) {
		return {
			valid: false,
			message: 'Binary .usdc files are not supported yet. Convert to .usda using usdcat.'
		};
	}

	if (lower.endsWith('.usdz')) {
		return {
			valid: false,
			message: '.usdz packages are not supported yet. Extract the .usda layer first.'
		};
	}

	if (lower.endsWith('.usd')) {
		return {
			valid: false,
			message: '.usd files can be either binary or ASCII. Rename to .usda if it is ASCII text.'
		};
	}

	return {
		valid: false,
		message: 'Only .usda (ASCII) files are supported.'
	};
}

export function validateUsdaContent(content: string): ValidationResult {
	const trimmed = content.trimStart();

	if (!trimmed.startsWith('#usda')) {
		return {
			valid: false,
			message:
				'This file does not appear to be a valid .usda file. Expected #usda header on the first line.'
		};
	}

	return { valid: true };
}
