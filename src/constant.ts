export default {
    tsconfig: {
        compilerOptions: {
            target: 'ESNext',
            moduleResolution: 'bundler',
            module: 'ESNext',
            resolvePackageJsonImports: true,
            sourceMap: false
        },
        exclude: [
            'node_modules',
            'scripts'
        ],
        include: [
            'src/**/*'
        ]
    },
    package: {
        scripts: {
            build: 'webpack --mode production',
            dev: 'webpack --mode development --watch',
            zip: 'mxbe compile --zip --rebuild',
            mcpack: 'mxbe compile --mcpack --rebuild',
            update: 'mxbe update',
            import: 'mxbe import -b'
        }
    }
}