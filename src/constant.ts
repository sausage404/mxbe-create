import fs from "fs-extra";
import path from "path";

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
            zip: 'mxbe compile --rebuild',
            mcpack: 'mxbe compile --mcpack --rebuild',
            link: 'mxbe link'
        }
    },
    readme: fs.readFileSync(path.join(__dirname, '..', 'assets', 'README.md'), 'utf-8'),
    gitignore: fs.readFileSync(path.join(__dirname, '..', 'assets', '.gitignore'), 'utf-8')
}