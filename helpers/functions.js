import _ from 'lodash'
import fs from 'node:fs'

export const setFileTypeToGenerate = (fileType) => {
    switch (fileType) {
        case 'index':
            return 'index.txt'
        case 'entity':
            return 'entity.txt'
        case 'permissions':
            return 'permissions.txt'
        case 'seed':
            return 'seed.txt'
        case 'controller':
            return 'controller.txt'
        case 'actions':
            return 'actions.txt'
        case 'model':
            return 'model.txt'
        case 'api':
            return 'api.txt'
        case 'index.vue':
            return 'index.vue'
        default:
            return false
    }
}

export const copyFileWithParameter = async (
    sourcePath,
    destinationPath,
    parameter
    // placeholder
) => {
    // Read the source file
    const fileContent = fs.readFileSync(sourcePath, 'utf8')

    // Replace all occurrences of the placeholder with the parameter
    const updatedContent = fileContent.replace(
        /EntityName/g,
        _.upperFirst(_.camelCase(parameter))
    )
    // Write the updated content to the destination file
    fs.writeFileSync(destinationPath, updatedContent, 'utf8')

    const updatedContent2 = updatedContent.replace(
        /folderName/g,
        _.camelCase(parameter)
    )

    fs.writeFileSync(destinationPath, updatedContent2, 'utf8')
}

export const generateFiles = async (
    project,
    pathToSourceFolder,
    folderPath
) => {
    const componentName = project.folder.split('/').pop()
    for (const tool of project.tools) {
        const fileType = setFileTypeToGenerate(tool)
        if (fileType) {
            let destinationFilePath
            const sourceFilePath = `${pathToSourceFolder}/source/${project.type}/${fileType}`
            if (fileType === 'index.vue') {
                destinationFilePath = `${folderPath}/${fileType}`
            }
            destinationFilePath = `${folderPath}/${fileType.replace(
                '.txt',
                '.js'
            )}`
            // create files based on selected tools
            await copyFileWithParameter(
                sourceFilePath,
                destinationFilePath,
                componentName
            )
        }
    }
}

export const folderPathFunction = (project) => {
    let folderPath
    if (project.type === 'backend') {
        folderPath = `${process.cwd()}/backend/src/components/${project.folder}`
    } else if (project.type === 'frontend') {
        folderPath = `${process.cwd()}/frontend/src/entities/${project.folder}`
    } else {
        folderPath = `${process.cwd()}/frontend/src/views/${_.upperFirst(
            _.camelCase(project.folder)
        )}`
    }
    return folderPath
}
