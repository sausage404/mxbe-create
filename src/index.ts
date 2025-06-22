import path from "path";
import { inputSimple, selectExtension } from "./prompt";
import behavior from "./services/behavior";
import resource from "./services/resource";
import { execSync } from "child_process";
import inquirer from "inquirer";

export default async (skip: boolean) => {
    if (!skip) {
        console.log("Installing @mxbe/cli globally...");
        console.log("If next time you want to use this package, you can run 'npm create mxbe -s' to skip this step.");
        execSync("npm install -g @mxbe/cli", { stdio: 'ignore' });
    }
    const extension = await selectExtension();
    const simple = await inputSimple();

    const projectFolder = `${simple.projectName}-${extension === "behavior" ? "bp" : "rp"}`;
    const projectPath = path.resolve(process.cwd(), projectFolder);


    if (extension === "behavior") {
        await behavior(projectPath, simple);
    } else {
        await resource(projectPath, simple);
    }
}