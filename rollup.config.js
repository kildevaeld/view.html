const resolve = require('rollup-plugin-node-resolve'),
    commonjs = require('rollup-plugin-commonjs'),
    babel = require('rollup-plugin-babel'),
    typescript = require('rollup-plugin-typescript');

const pkg = require('./package.json');

module.exports = [
    // browser-friendly UMD build
    {
        input: './src/index.ts',
        output: {
            file: pkg.browser,
            format: 'umd',
            name: 'view.html'
        },
        external: ["view", "view.data"],
        globals: {
            view: 'view',
            'view.data': 'view.data'
        },
        plugins: [
            typescript({
                typescript: require('typescript')
            }),
            resolve(),
            commonjs(),
            babel({
                exclude: ['node_modules/**']
            })
        ]
    },
];