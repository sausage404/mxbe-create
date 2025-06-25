import fs from "fs-extra";
import path from "path";
import { v4 } from "uuid";
import { SimpleResponse } from "../prompt";

export default async (projectPath: string, simple: SimpleResponse) => {
    const resourcePath = path.join(projectPath, 'resource');
    await fs.ensureDir(resourcePath);
    await fs.ensureDir(path.join(resourcePath, 'textures'));
    await fs.copy(
        path.join(__dirname, '..', '..', 'assets', 'pack_icon.png'),
        path.join(resourcePath, 'pack_icon.png')
    );
    await fs.writeJSON(path.join(resourcePath, "manifest.json"), {
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
}