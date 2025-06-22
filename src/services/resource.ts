import fs from "fs-extra";
import path from "path";
import { v4 } from "uuid";
import { SimpleResponse } from "../prompt";

export default async (projectPath: string, simple: SimpleResponse) => {
    await fs.ensureDir(projectPath);
    await fs.ensureDir(path.join(projectPath, 'textures'));
    await fs.copy(
        path.join(__dirname, '..', '..', 'assets', 'pack_icon.png'),
        path.join(projectPath, 'pack_icon.png')
    );
    await fs.writeJSON(path.join(projectPath, "manifest.json"), {
        format_version: 2,
        header: {
            name: simple.projectName,
            description: simple.projectDescription,
            uuid: v4(),
            version: [1, 0, 0],
            min_engine_version: simple.minimumEngineVersion.split('.').map(Number)
        },
        modules: [
            {
                type: "resource",
                uuid: v4(),
                version: [1, 0, 0],
            }
        ],
        metadata: {
            authors: simple.authorName.split(',').map(author => author.trim())
        }
    }, { spaces: 2 });
    console.log([
        "Project created successfully.",
        `Run 'code ${path.basename(projectPath)}' to open the project in Visual Studio Code.`
    ].join('\n'));
}