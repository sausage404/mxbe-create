import fs from "fs-extra";
import path from "path";
import common from "@mxbe/common";
import behavior from "./services/behavior";
import resource from "./services/resource";
import { execSync } from "child_process";
import { inputSimple, selectExtension } from "./prompt";
import constant from "./constant";
import cliProgress from "cli-progress";
import { v4 } from "uuid";

export default async (skip: boolean) => {
    if (!skip) {
        console.log("Installing @mxbe/cli globally...");
        console.log("If next time you want to use this package, you can run 'npm create mxbe -s' to skip this step.");
        execSync("npm install -g @mxbe/cli", { stdio: 'ignore' });
    }
    const extension = await selectExtension();
    const simple = await inputSimple();

    const projectPath = path.resolve(process.cwd(), simple.projectName);

    const uuid = extension.includes("resource") ? v4() : null;

    extension.includes("behavior") && await behavior(projectPath, simple, uuid);
    extension.includes("resource") && await resource(projectPath, simple, uuid);

    if (!(await fs.exists(path.join(projectPath, "package.json")))) {
        await fs.writeJSON(path.join(projectPath, "package.json"), {
            name: path.basename(projectPath),
            ...constant.package
        }, { spaces: 2 });
        const bar = new cliProgress.SingleBar({
            format: 'Installing [{bar}] {percentage}% | {value}/{total} | {module}',
            barCompleteChar: '█',
            barIncompleteChar: '░',
            hideCursor: true
        }, cliProgress.Presets.shades_classic);

        bar.start(common.pkg.compiler.length + 1, 0, { module: '' });

        bar.increment();

        for (const module of common.pkg.compiler) {
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
    }

    await fs.writeFile(path.join(projectPath, "README.md"), constant.readme);
    await fs.writeFile(path.join(projectPath, ".gitignore"), constant.gitignore);
    await fs.writeFile(path.join(projectPath, ".env"), [
        `BASE_PATH=AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang`,
        `BEHAVIOR_PATH=development_behavior_packs`,
        `RESOURCE_PATH=development_resource_packs`
    ].join("\n"));

    console.log([
        `Successfully created project ${simple.projectName}`,
        `Run 'code ${simple.projectName}' to open the project in Visual Studio Code`,
    ].join("\n"));
}