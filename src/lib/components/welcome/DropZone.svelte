<script lang="ts">
	let { onfileload }: { onfileload: (name: string, content: string) => void } = $props();

	let isDragging = $state(false);
	let errorMessage = $state('');
	let fileInput: HTMLInputElement;

	function validateFile(file: File): string | null {
		const name = file.name.toLowerCase();
		if (name.endsWith('.usda')) return null;
		if (name.endsWith('.usdc'))
			return 'Binary .usdc files are not supported yet. Convert to .usda using usdcat.';
		if (name.endsWith('.usdz'))
			return '.usdz packages are not supported yet. Extract the .usda layer first.';
		if (name.endsWith('.usd'))
			return '.usd files can be either binary or ASCII. Rename to .usda if it is ASCII text.';
		return 'Only .usda (ASCII) files are supported.';
	}

	function handleFile(file: File) {
		const error = validateFile(file);
		if (error) {
			errorMessage = error;
			setTimeout(() => (errorMessage = ''), 5000);
			return;
		}
		errorMessage = '';
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				onfileload(file.name, reader.result);
			}
		};
		reader.readAsText(file);
	}

	function ondragover(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function ondragleave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function ondrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) handleFile(file);
	}

	function onclick() {
		fileInput?.click();
	}

	function onchange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) handleFile(file);
	}
</script>

<div
	class="dropzone"
	class:dropzone--active={isDragging}
	class:dropzone--error={errorMessage}
	role="button"
	tabindex="0"
	{ondragover}
	{ondragleave}
	{ondrop}
	{onclick}
	onkeydown={(e) => e.key === 'Enter' && onclick()}
>
	<input bind:this={fileInput} type="file" accept=".usda" {onchange} class="visually-hidden" />

	<div class="dropzone__icon">
		<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
			<path
				d="M24 32V16M24 16L18 22M24 16L30 22"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8 32L8 36C8 38.2091 9.79086 40 12 40L36 40C38.2091 40 40 38.2091 40 36L40 32"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>

	<p class="dropzone__label">
		{#if isDragging}
			Drop your .usda file here
		{:else}
			Drag & drop a <strong>.usda</strong> file here
		{/if}
	</p>

	<p class="dropzone__sublabel">or click to browse</p>

	{#if errorMessage}
		<p class="dropzone__error">{errorMessage}</p>
	{/if}
</div>

<style>
	.dropzone {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		padding: var(--space-12) var(--space-8);
		border: 2px dashed var(--color-border-default);
		border-radius: var(--radius-xl);
		background: var(--color-bg-base);
		cursor: pointer;
		transition: var(--transition-all);
		outline: none;
	}

	.dropzone:hover {
		border-color: var(--color-border-strong);
		background: var(--color-bg-raised);
	}

	.dropzone:focus-visible {
		border-color: var(--color-border-focus);
		box-shadow: var(--shadow-glow-accent);
	}

	.dropzone--active {
		border-color: var(--color-accent);
		background: var(--color-accent-bg);
		box-shadow: var(--shadow-glow-accent);
		transform: scale(1.01);
	}

	.dropzone--error {
		border-color: var(--color-warning);
	}

	.dropzone__icon {
		color: var(--color-text-muted);
		transition: var(--transition-all);
	}

	.dropzone:hover .dropzone__icon,
	.dropzone--active .dropzone__icon {
		color: var(--color-accent);
		transform: translateY(-2px);
	}

	.dropzone__label {
		font-size: var(--font-size-lg);
		color: var(--color-text-secondary);
		transition: var(--transition-colors);
	}

	.dropzone:hover .dropzone__label {
		color: var(--color-text-primary);
	}

	.dropzone__label strong {
		color: var(--color-accent);
	}

	.dropzone__sublabel {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
	}

	.dropzone__error {
		margin-top: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-warning-bg);
		border: 1px solid var(--color-warning-border);
		border-radius: var(--radius-md);
		color: var(--color-warning);
		font-size: var(--font-size-sm);
		animation: shake 0.4s var(--ease-out);
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-6px);
		}
		75% {
			transform: translateX(6px);
		}
	}
</style>
