import rollupTypescript from 'rollup-plugin-typescript';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: './src/app/app.ts',
  dest: './build/scripts/app.js',
  format: 'cjs',
  sourceMap: true,
  plugins: [
    rollupTypescript({
        typescript: require('typescript')
    }),
    nodeResolve({
        jsnext: true,
        main: true
    }),
    babel({
        exclude: 'node_modules/**',
        presets: 'es2015-rollup'
    })
  ],
  external: [
      'lodash'
  ]
}
