import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'lib',
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-native'],
  esbuildOptions(options) {
    options.platform = 'neutral';
    options.packages = 'external';
  },
});
