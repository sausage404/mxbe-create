import path from "path";
import { inputSimple, selectExtension } from "./prompt";
import behavior from "./services/behavior";
import resource from "./services/resource";
import { execSync } from "child_process";

export default async (skip: boolean) => {
    const extension = await selectExtension();
    const simple = await inputSimple();

    const projectFolder = `${simple.projectName}-${extension === "behavior" ? "bp" : "rp"}`;
    const projectPath = path.resolve(process.cwd(), projectFolder);

    if (!skip) {
        execSync("npm install -g @mxbe/cli", { stdio: 'ignore' });
    }

    if (extension === "behavior") {
        await behavior(projectPath, simple);
    } else {
        await resource(projectPath, simple);
    }
}