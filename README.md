# usd-viz

Visualize USD scene graphs as interactive node trees. Drag in a `.usda` file and instantly explore its hierarchy, inspect properties, and spot issues.

**100% client-side. Your files never leave your browser.**

## What is this?

usd-viz is a free, open-source tool for anyone working with [Universal Scene Description (USD)](https://openusd.org) files. It parses `.usda` (ASCII) files in the browser and renders them as an interactive node graph — no installs, no uploads, no server.

Built for pipeline TDs, technical artists, and anyone who's ever stared at a `.usda` file wondering why something isn't resolving.

## Features

- **Drag & drop** — Drop a `.usda` file or pick from sample files
- **Node graph** — Visualize your scene hierarchy with zoom, pan, and auto-fit
- **Scene outline** — Collapsible tree view for quick navigation
- **Property inspector** — Click any node to see its properties, references, variant sets, and issues
- **Validation** — Flags missing references, empty overs, and other common problems
- **Privacy first** — Everything runs in-browser. Zero network requests. Your proprietary assets stay on your machine.

## Getting started

```sh
git clone https://github.com/barrylachapelle/usd-viz.git
cd usd-viz
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and drop a `.usda` file on the page.

## Sample files

Don't have a `.usda` file handy? The welcome screen includes four sample files from different industries:

| Sample | Industry | What it demonstrates |
|--------|----------|---------------------|
| VFX Shot | VFX | Multi-layer shot with lighting, characters, environment references |
| Game Level | Games | Props with LOD variant sets, collision meshes, material bindings |
| Building | Architecture | Nested floors, rooms, walls with material assignments |
| Robot Arm | Robotics | Articulated joint chain with custom attributes |

## Tech stack

- [SvelteKit](https://svelte.dev) with Svelte 5 (runes)
- Static adapter — builds to plain static files, no server
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — bundled, no CDN
- Custom `.usda` recursive descent parser
- TypeScript throughout
- Dark mode only

## Supported files

| Format | Supported | Notes |
|--------|-----------|-------|
| `.usda` | Yes | ASCII USD — this is what usd-viz parses |
| `.usdc` | No | Binary USD — convert with `usdcat` first |
| `.usdz` | No | Packaged USD — extract the `.usda` layer first |

## Building for production

```sh
npm run build
```

Outputs static files to `build/`. Serve with any static host — Vercel, Netlify, Cloudflare Pages, GitHub Pages, or just `npx serve build` locally.

## Contributing

Contributions are welcome! This is an early-stage project and there's a lot of room to help out.

Some ideas:

- Improve the `.usda` parser to handle more syntax
- Add support for `.usdc` via WebAssembly
- Keyboard navigation in the node graph
- Search/filter in the scene outline
- Better layout algorithms for wide trees
- Accessibility improvements

Please open an issue first if you're planning something big so we can talk through the approach.

## License

MIT

---

Made with care for the USD community.
