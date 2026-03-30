export interface ParsedUsdFile {
	version: string;
	metadata: Record<string, string>;
	rootPrims: UsdPrim[];
	layers: LayerInfo[];
	warnings: UsdWarning[];
}

export interface UsdPrim {
	id: string;
	path: string;
	name: string;
	specifier: 'def' | 'over' | 'class';
	typeName: string;
	properties: UsdProperty[];
	children: UsdPrim[];
	references: string[];
	payloads: string[];
	variantSets: VariantSet[];
	depth: number;
	status: 'valid' | 'warning' | 'error';
	issues: string[];
}

export interface UsdProperty {
	name: string;
	typeName: string;
	value: string;
	isCustom: boolean;
	interpolation?: string;
}

export interface VariantSet {
	name: string;
	variants: string[];
	selection?: string;
}

export interface LayerInfo {
	filename: string;
	type: 'root' | 'sublayer' | 'reference' | 'payload';
	strength: number;
	status: 'valid' | 'warning' | 'error';
	issues: string[];
}

export interface UsdWarning {
	path: string;
	message: string;
	severity: 'warning' | 'error';
}

export interface LayoutNode {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	prim: UsdPrim;
	parentId: string | null;
}
