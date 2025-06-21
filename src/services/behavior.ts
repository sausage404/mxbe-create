import fs from "fs-extra";
import path from "path";
import common from "@mxbe/common";
import { v4 } from "uuid";
import { confirmAPI, inputScript, selectDependencyVersion, SimpleResponse } from "../prompt";
import constant from "../constant";
import { execSync } from "child_process";
import cliProgress from "cli-progress";

export default async (projectPath: string, simple: SimpleResponse) => {

    const api = await confirmAPI();

    const manifest = {
        format_version: 2,
        header: {
            name: simple.projectName,
            description: simple.projectDescription,
            uuid: v4(),
            version: [1, 0, 0],
            min_engine_version: simple.minimumEngineVersion.split('.').map(Number)
        },
        metadata: {
            author: simple.authorName.split(',').map(author => author.trim())
        }
    }

    if (api) {
        const script = await inputScript();
        const dependencies = await selectDependencyVersion(script.dependencies, script.version);

        const isTypeScript = script.language === 'typescript';

        await fs.ensureDir(projectPath);
        await fs.copy(
            path.join(__dirname, '..', '..', 'assets', 'pack_icon.png'),
            path.join(projectPath, 'pack_icon.png')
        );
        await fs.ensureDir(path.join(projectPath, 'scripts'));
        await fs.ensureDir(path.join(projectPath, 'src'));
        await fs.writeFile(path.join(projectPath, `/src/index.${isTypeScript ? 'ts' : 'js'}`), '');
        await fs.writeJson(path.join(projectPath, 'package.json'), {
            name: path.basename(projectPath),
            ...constant.package
        }, { spaces: 2 });
        await fs.writeJSON(path.join(projectPath, "manifest.json"), {
            ...manifest,
            capabilities: ['script_eval'],
            modules: [
                {
                    type: 'script',
                    language: 'javascript',
                    uuid: '',
                    entry: 'scripts/bundle.js',
                    version: [1, 0, 0]
                }
            ],
            dependencies: Object.entries(dependencies)
                .filter(([name]) => common.pkg.modules.includes(name))
                .map(([name, version]) => ({
                    module_name: name,
                    version: version.includes('beta') ? `${version.split('-')[0]}-beta` : version.split('-')[0],
                })),
        }, { spaces: 2 });
        await fs.copy(
            path.join(__dirname, '..', '..', 'assets', 'webpack', `webpack.${isTypeScript ? 'ts' : 'js'}`),
            path.join(projectPath, 'webpack.config.js')
        )
        if (isTypeScript) {
            await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), constant.tsconfig, { spaces: 2 });
        }

        const modules = [
            ...common.pkg.compiler,
            ...script.addons,
            ...script.dependencies.map(dep =>
                `${dep}@${dependencies[dep]}`
            )
        ]

        const bar = new cliProgress.SingleBar({
            format: 'Installing [{bar}] {percentage}% | {value}/{total} | {module}',
            barCompleteChar: '█',
            barIncompleteChar: '░',
            hideCursor: true
        }, cliProgress.Presets.shades_classic);

        bar.start(modules.length + 1, 0, { module: '' });

        bar.increment();

        for (const module of modules) {
            bar.update({ module });

            try {
                execSync(`npm install -D ${module} --legacy-peer-deps`, { cwd: projectPath, stdio: 'ignore' });
            } catch (err: any) {
                bar.stop();
                console.error(`Failed to install ${module}`);
                console.error(err.message);
                process.exit(1);
            }

            bar.increment();
        }

        bar.stop();
    } else {
        await fs.ensureDir(projectPath);
        await fs.copy(
            path.join(__dirname, '..', '..', 'assets', 'pack_icon.png'),
            path.join(projectPath, 'pack_icon.png')
        );
        await fs.writeJSON(path.join(projectPath, "manifest.json"), {
            ...manifest,
            modules: [
                {
                    type: "behavior",
                    uuid: v4(),
                    version: [1, 0, 0],
                }
            ],
        }, { spaces: 2 });
    }

    console.log([
        "Project created successfully.",
        `Run 'code ${path.basename(projectPath)}' to open the project in Visual Studio Code.`,
        `Run 'npm run dev' to start the development server.`,
    ].join('\n'));
}