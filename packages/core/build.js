require('esbuild')
  .build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'node',
    external: ['electron'],
    outdir: 'build',
  })
  .catch(() => process.exit(1));

const { Generator } = require('npm-dts');

new Generator({
  entry: './src/index.ts',
  output: './build/index.d.ts',
}).generate();
