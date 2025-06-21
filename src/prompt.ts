import inquirer from "inquirer";
import common from "@mxbe/common";

type ExtensionResponse = Promise<"behavior" | "resource">

export const selectExtension = async (): ExtensionResponse => {
    const { extension } = await inquirer.prompt([
        {
            type: "select",
            name: "extension",
            message: "Select a extension type",
            choices: [
                {
                    name: "Behavior Pack",
                    value: "behavior"
                },
                {
                    name: "Resource Pack",
                    value: "resource"
                }
            ]
        }
    ])
    return extension
}

export type SimpleResponse = {
    projectName: string,
    projectDescription: string,
    authorName: string,
    minimumEngineVersion: string
}

export const inputSimple = async (): Promise<SimpleResponse> => {
    return await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'What is the name of the project?',
            validate: input => /^[a-z0-9-]+$/.test(input) || 'Project name may only include lowercase letters, numbers, and hyphens'
        },
        {
            type: 'input',
            name: 'projectDescription',
            message: 'What is the description of the project?',
            validate: input => input.length > 0 || 'Project description is required'
        },
        {
            type: 'input',
            name: 'authorName',
            message: 'What is the author\'s name? Use commas to separate multiple authors(,).',
            validate: input => input.length > 0 || 'Author name is required'
        },
        {
            type: 'input',
            name: 'minimumEngineVersion',
            message: 'What is the minimum engine version required?',
            validate: input => {
                if (input.length === 0) return 'Minimum engine version is required';
                const [major, minor, patch] = input.split('.');
                const response = 'Minimum engine version must be in the format x.x.x';
                return (!isNaN(parseInt(major)) && !isNaN(parseInt(minor)) && !isNaN(parseInt(patch))) || response
            }
        }
    ])
}

export const confirmAPI = async () => {
    const { api } = await inquirer.prompt([
        {
            type: "confirm",
            name: "api",
            message: "Do you want to add a script api to behavior?",
            default: true
        }
    ])
    return api
}

type ScriptResponse = {
    language: string,
    version: string,
    dependencies: string[],
    addons: string[]
}

export const inputScript = async (): Promise<ScriptResponse> => {
    return await inquirer.prompt([
        {
            type: 'list',
            name: 'language',
            message: 'Which language do you want to use?',
            choices: ['typescript', 'javascript']
        },
        {
            type: 'list',
            name: 'version',
            message: 'What game type would you like to use?',
            choices: ['stable', 'preview'],
        },
        {
            type: 'checkbox',
            name: 'dependencies',
            message: 'Which dependencies would you like to add?',
            default: ['@minecraft/server', '@minecraft/vanilla-data'],
            choices: [
                ...common.pkg.modules,
                ...common.pkg.plugins
            ],
            validate: input => input.length > 0 || 'At least one dependency is required'
        },
        {
            type: 'checkbox',
            name: 'addons',
            message: 'Which addons would you like to add?',
            choices: [
                ...common.pkg.addons
            ],
        }
    ])
}

export const selectDependencyVersion = async (dependencies: string[], version: string) => {
    const response = await common.getDependencyVersions(dependencies, version);
    return await inquirer.prompt(response.map(({ name, choices }) => ({
        type: 'list',
        name,
        message: `Which ${name} version would you like to use?`,
        choices
    })))
}