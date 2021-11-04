require('esbuild')
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'node',
    external: ['electron'],
    outdir: 'build',
  })
  .catch(() => process.exit(1));
