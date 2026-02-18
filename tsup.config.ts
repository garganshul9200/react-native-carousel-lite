import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'lib',
  splitting: false,
  sourcemap: false,
  minify: true,
  clean: true,
  external: ['react', 'react-native'],
  esbuildOptions(options) {
    options.platform = 'neutral';
    options.packages = 'external';
  },
});
