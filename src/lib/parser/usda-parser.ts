import type { ParsedUsdFile, UsdPrim, UsdProperty, VariantSet, LayerInfo, UsdWarning } from './types';

let primIdCounter = 0;

function nextId(): string {
	return `prim_${primIdCounter++}`;
}

interface TokenStream {
	content: string;
	pos: number;
}

function skipWhitespaceAndComments(stream: TokenStream): void {
	while (stream.pos < stream.content.length) {
		const ch = stream.content[stream.pos];
		if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') {
			stream.pos++;
		} else if (ch === '#') {
			// Skip line comment
			while (stream.pos < stream.content.length && stream.content[stream.pos] !== '\n') {
				stream.pos++;
			}
		} else {
			break;
		}
	}
}

function peekChar(stream: TokenStream): string {
	return stream.pos < stream.content.length ? stream.content[stream.pos] : '';
}

function readChar(stream: TokenStream): string {
	return stream.content[stream.pos++] || '';
}

function readQuotedString(stream: TokenStream): string {
	const quote = readChar(stream); // consume opening quote
	let result = '';
	let escaped = false;

	while (stream.pos < stream.content.length) {
		const ch = readChar(stream);
		if (escaped) {
			result += ch;
			escaped = false;
		} else if (ch === '\\') {
			escaped = true;
		} else if (ch === quote) {
			// Check for triple-quote continuation
			return result;
		} else {
			result += ch;
		}
	}
	return result;
}

function readUntil(stream: TokenStream, stopChars: string): string {
	let result = '';
	while (stream.pos < stream.content.length && !stopChars.includes(stream.content[stream.pos])) {
		result += stream.content[stream.pos++];
	}
	return result;
}

function readWord(stream: TokenStream): string {
	let result = '';
	while (stream.pos < stream.content.length) {
		const ch = stream.content[stream.pos];
		if (/[a-zA-Z0-9_:.]/.test(ch)) {
			result += ch;
			stream.pos++;
		} else {
			break;
		}
	}
	return result;
}

function readValue(stream: TokenStream): string {
	skipWhitespaceAndComments(stream);
	const ch = peekChar(stream);

	if (ch === '"' || ch === "'") {
		return readQuotedString(stream);
	}

	if (ch === '(') {
		return readBalanced(stream, '(', ')');
	}

	if (ch === '[') {
		return readBalanced(stream, '[', ']');
	}

	// Read until newline or closing paren/bracket
	return readUntil(stream, '\n)]}').trim();
}

function readBalanced(stream: TokenStream, open: string, close: string): string {
	let depth = 0;
	let result = '';

	while (stream.pos < stream.content.length) {
		const ch = stream.content[stream.pos];
		if (ch === '"' || ch === "'") {
			result += ch;
			stream.pos++;
			// Read through quoted string
			while (stream.pos < stream.content.length) {
				const qch = stream.content[stream.pos];
				result += qch;
				stream.pos++;
				if (qch === ch) break;
				if (qch === '\\' && stream.pos < stream.content.length) {
					result += stream.content[stream.pos];
					stream.pos++;
				}
			}
			continue;
		}

		if (ch === open) depth++;
		if (ch === close) {
			depth--;
			if (depth === 0) {
				stream.pos++;
				return result + close;
			}
		}
		result += ch;
		stream.pos++;
	}
	return result;
}

function parseMetadata(stream: TokenStream): Record<string, string> {
	const metadata: Record<string, string> = {};
	skipWhitespaceAndComments(stream);

	if (peekChar(stream) !== '(') return metadata;
	readChar(stream); // consume (

	while (stream.pos < stream.content.length) {
		skipWhitespaceAndComments(stream);
		if (peekChar(stream) === ')') {
			readChar(stream);
			break;
		}

		const key = readWord(stream);
		if (!key) {
			stream.pos++;
			continue;
		}

		skipWhitespaceAndComments(stream);
		if (peekChar(stream) === '=') {
			readChar(stream); // consume =
			skipWhitespaceAndComments(stream);
			metadata[key] = readValue(stream);
		}
	}

	return metadata;
}

function parseProperties(stream: TokenStream): UsdProperty[] {
	const properties: UsdProperty[] = [];

	// We're inside a prim body, look for property declarations
	// Format: typeName name = value or custom typeName name = value
	const saved = stream.pos;
	skipWhitespaceAndComments(stream);
	const word = readWord(stream);

	// Restore — this is called speculatively
	stream.pos = saved;

	return properties;
}

function parsePrimBody(
	stream: TokenStream,
	parentPath: string,
	depth: number
): { children: UsdPrim[]; properties: UsdProperty[]; references: string[]; payloads: string[]; variantSets: VariantSet[] } {
	const children: UsdPrim[] = [];
	const properties: UsdProperty[] = [];
	const references: string[] = [];
	const payloads: string[] = [];
	const variantSets: VariantSet[] = [];

	while (stream.pos < stream.content.length) {
		skipWhitespaceAndComments(stream);
		if (peekChar(stream) === '}') {
			readChar(stream);
			break;
		}

		const lineStart = stream.pos;
		const word = readWord(stream);

		if (word === 'def' || word === 'over' || word === 'class') {
			const prim = parsePrim(stream, word as 'def' | 'over' | 'class', parentPath, depth);
			if (prim) children.push(prim);
			continue;
		}

		if (word === 'variantSet') {
			const vs = parseVariantSet(stream);
			if (vs) variantSets.push(vs);
			continue;
		}

		// Check for custom keyword
		if (word === 'custom' || word === 'uniform') {
			skipWhitespaceAndComments(stream);
			const typeName = readWord(stream);
			skipWhitespaceAndComments(stream);
			const propName = readWord(stream);
			skipWhitespaceAndComments(stream);

			if (peekChar(stream) === '=') {
				readChar(stream);
				skipWhitespaceAndComments(stream);
				const value = readValue(stream);
				properties.push({
					name: propName,
					typeName,
					value,
					isCustom: word === 'custom'
				});
			}
			continue;
		}

		// Try to parse as a property: typeName name = value
		if (word && /^[a-z]/.test(word)) {
			skipWhitespaceAndComments(stream);
			const maybeName = readWord(stream);
			skipWhitespaceAndComments(stream);

			if (maybeName && peekChar(stream) === '=') {
				readChar(stream);
				skipWhitespaceAndComments(stream);
				const value = readValue(stream);

				// Check for references/payloads in metadata-like properties
				if (maybeName === 'references' || word === 'prepend' || word === 'append') {
					const refMatch = value.match(/@([^@]+)@/g);
					if (refMatch) {
						references.push(...refMatch.map((r) => r.replace(/@/g, '')));
					}
				}

				properties.push({
					name: maybeName,
					typeName: word,
					value,
					isCustom: false
				});
				continue;
			}
		}

		// Check for reference/payload declarations at prim level
		if (word === 'prepend' || word === 'append' || word === 'add') {
			const rest = readUntil(stream, '\n');
			const refMatch = rest.match(/@([^@]+)@/g);
			if (refMatch) {
				if (rest.includes('references')) {
					references.push(...refMatch.map((r) => r.replace(/@/g, '')));
				} else if (rest.includes('payload')) {
					payloads.push(...refMatch.map((r) => r.replace(/@/g, '')));
				}
			}
			continue;
		}

		// Skip unrecognized content
		if (stream.pos === lineStart) {
			stream.pos++;
		}
		readUntil(stream, '\n}');
	}

	return { children, properties, references, payloads, variantSets };
}

function parseVariantSet(stream: TokenStream): VariantSet | null {
	skipWhitespaceAndComments(stream);

	let name = '';
	if (peekChar(stream) === '"') {
		name = readQuotedString(stream);
	} else {
		name = readWord(stream);
	}

	skipWhitespaceAndComments(stream);
	if (peekChar(stream) !== '=') return null;
	readChar(stream);

	skipWhitespaceAndComments(stream);
	if (peekChar(stream) !== '{') return null;
	readChar(stream);

	const variants: string[] = [];

	while (stream.pos < stream.content.length) {
		skipWhitespaceAndComments(stream);
		if (peekChar(stream) === '}') {
			readChar(stream);
			break;
		}

		if (peekChar(stream) === '"') {
			const variantName = readQuotedString(stream);
			variants.push(variantName);

			// Skip variant body
			skipWhitespaceAndComments(stream);
			if (peekChar(stream) === '{') {
				readBalanced(stream, '{', '}');
			}
		} else {
			stream.pos++;
		}
	}

	return { name, variants };
}

function parsePrim(
	stream: TokenStream,
	specifier: 'def' | 'over' | 'class',
	parentPath: string,
	depth: number
): UsdPrim | null {
	skipWhitespaceAndComments(stream);

	// Read type name (optional)
	let typeName = '';
	if (peekChar(stream) !== '"') {
		typeName = readWord(stream);
		skipWhitespaceAndComments(stream);
	}

	// Read prim name (quoted string)
	let name = '';
	if (peekChar(stream) === '"') {
		name = readQuotedString(stream);
	} else {
		name = readWord(stream);
	}

	if (!name) return null;

	const path = parentPath ? `${parentPath}/${name}` : `/${name}`;

	// Check for metadata
	skipWhitespaceAndComments(stream);
	let primMetadata: Record<string, string> = {};
	if (peekChar(stream) === '(') {
		primMetadata = parseMetadata(stream);
	}

	// Parse body
	skipWhitespaceAndComments(stream);
	let children: UsdPrim[] = [];
	let properties: UsdProperty[] = [];
	let references: string[] = [];
	let payloads: string[] = [];
	let variantSets: VariantSet[] = [];

	if (peekChar(stream) === '{') {
		readChar(stream);
		const body = parsePrimBody(stream, path, depth + 1);
		children = body.children;
		properties = body.properties;
		references = body.references;
		payloads = body.payloads;
		variantSets = body.variantSets;
	}

	// Extract references from metadata
	if (primMetadata.references) {
		const refMatch = primMetadata.references.match(/@([^@]+)@/g);
		if (refMatch) {
			references.push(...refMatch.map((r) => r.replace(/@/g, '')));
		}
	}

	if (primMetadata.payload) {
		const payloadMatch = primMetadata.payload.match(/@([^@]+)@/g);
		if (payloadMatch) {
			payloads.push(...payloadMatch.map((r) => r.replace(/@/g, '')));
		}
	}

	const issues: string[] = [];
	let status: 'valid' | 'warning' | 'error' = 'valid';

	// Check for potential issues
	if (references.some((r) => r.startsWith('./'))) {
		issues.push('Contains relative references that may not resolve');
		status = 'warning';
	}

	if (specifier === 'over' && properties.length === 0 && children.length === 0) {
		issues.push('Empty over — no opinions applied');
		status = 'warning';
	}

	return {
		id: nextId(),
		path,
		name,
		specifier,
		typeName: typeName || 'Untyped',
		properties,
		children,
		references,
		payloads,
		variantSets,
		depth,
		status,
		issues
	};
}

export function parseUsdaFile(filename: string, content: string): ParsedUsdFile {
	primIdCounter = 0;

	const stream: TokenStream = { content, pos: 0 };
	const warnings: UsdWarning[] = [];

	// Read header line
	skipWhitespaceAndComments(stream);
	const headerLine = readUntil(stream, '\n');
	const versionMatch = headerLine.match(/#usda\s+([\d.]+)/);
	const version = versionMatch ? versionMatch[1] : '1.0';

	// Parse top-level metadata
	skipWhitespaceAndComments(stream);
	const metadata = parseMetadata(stream);

	// Extract sublayers from metadata
	const sublayers: string[] = [];
	if (metadata.subLayers) {
		const layerMatches = metadata.subLayers.match(/@([^@]+)@/g);
		if (layerMatches) {
			sublayers.push(...layerMatches.map((m) => m.replace(/@/g, '')));
		}
	}

	// Parse top-level prims
	const rootPrims: UsdPrim[] = [];
	while (stream.pos < stream.content.length) {
		skipWhitespaceAndComments(stream);
		if (stream.pos >= stream.content.length) break;

		const word = readWord(stream);
		if (word === 'def' || word === 'over' || word === 'class') {
			const prim = parsePrim(stream, word as 'def' | 'over' | 'class', '', 0);
			if (prim) rootPrims.push(prim);
		} else if (word) {
			// Skip unrecognized top-level content
			readUntil(stream, '\n');
		} else {
			stream.pos++;
		}
	}

	// Build layer info
	const layers: LayerInfo[] = [];

	// Root layer is always the file itself
	layers.push({
		filename,
		type: 'root',
		strength: 0,
		status: 'valid',
		issues: []
	});

	// Add sublayers (ordered by strength, first = strongest)
	sublayers.forEach((sublayer, i) => {
		layers.push({
			filename: sublayer.split('/').pop() || sublayer,
			type: 'sublayer',
			strength: i + 1,
			status: 'valid',
			issues: []
		});
	});

	// Collect all references and payloads from prims
	function collectRefs(prims: UsdPrim[]) {
		for (const prim of prims) {
			for (const ref of prim.references) {
				const refFilename = ref.split('/').pop() || ref;
				if (!layers.some((l) => l.filename === refFilename)) {
					layers.push({
						filename: refFilename,
						type: 'reference',
						strength: layers.length,
						status: 'valid',
						issues: []
					});
				}
			}
			for (const payload of prim.payloads) {
				const payloadFilename = payload.split('/').pop() || payload;
				if (!layers.some((l) => l.filename === payloadFilename)) {
					layers.push({
						filename: payloadFilename,
						type: 'payload',
						strength: layers.length,
						status: 'valid',
						issues: []
					});
				}
			}
			collectRefs(prim.children);
		}
	}
	collectRefs(rootPrims);

	// Generate warnings from prims
	function collectWarnings(prims: UsdPrim[]) {
		for (const prim of prims) {
			for (const issue of prim.issues) {
				warnings.push({
					path: prim.path,
					message: issue,
					severity: prim.status === 'error' ? 'error' : 'warning'
				});
			}
			collectWarnings(prim.children);
		}
	}
	collectWarnings(rootPrims);

	return {
		version,
		metadata,
		rootPrims,
		layers,
		warnings
	};
}
