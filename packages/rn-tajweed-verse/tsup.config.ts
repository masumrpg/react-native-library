import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  tsconfig: 'tsconfig.build.json',
  external: ['react', 'react-native', 'react-native-parsed-text', 'expo'],
});
