const esbuild = require("esbuild");
esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  format: "esm",
  assetNames: "assets-[name]",
  loader: {
    '.html': 'file',
  },
  target: ["esnext"],
  tsconfig: "tsconfig.build.json",
  outfile: "dist/index.js",
})

esbuild.build({
  entryPoints: ["src/browser/main.ts"],
  bundle: true,
  minify: true,
  outfile: "dist/www/script.js",
  tsconfig: "tsconfig.build.json"
})

esbuild.build({
  entryPoints: ['src/browser/main.css'],
  minify: true,
  bundle: true,
  outfile: 'dist/www/style.css',
})
