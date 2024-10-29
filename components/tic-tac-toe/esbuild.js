require("esbuild").buildSync({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  format: "esm",
  assetNames: "assets-[name]",
  loader: {
    '.html': 'file'
  },
  target: ["esnext"],
  tsconfig: "tsconfig.build.json",
  outfile: "dist/index.js",
})
