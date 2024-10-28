require("esbuild").buildSync({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  format: "esm",
  loader: {
    '.html': 'copy'
  },
  target: ["esnext"],
  tsconfig: "tsconfig.build.json",
  outfile: "dist/index.js",
})
