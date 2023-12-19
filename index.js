#!/usr/bin/env node
import fs from 'node:fs'
import { getPath } from 'global-modules-path'
import _ from 'lodash'
import * as p from '@clack/prompts'
import sa from 'shell-artist'
import { setTimeout } from 'node:timers/promises'
import color from 'picocolors'
import { generateFiles, folderPathFunction } from './helpers/functions.js'

async function main() {
    const pathToSourceFolder = getPath('ronikiko-cli')
    console.clear()
    sa.createAscii('Xfinance', {
        font: 'Ghost',
        horizontalLayout: 'full',
        verticalLayout: 'fitted',
        width: 180,
        whitespaceBreak: true,
    })
    p.intro(`${color.bgCyan(color.bgGreen(' xFinance '))}`)

    const project = await p.group(
        {
            type: () =>
                p.select({
                    message: 'Where do you want to generate files?',
                    maxItems: 5,
                    options: [
                        { value: 'backend', label: 'Backend' },
                        { value: 'frontend', label: 'Frontend' },
                        { value: 'frontend-view', label: 'Frontend/view' },
                    ],
                }),
            folder: ({ results }) => {
                return p.text({
                    message: 'Give your component a name',
                    placeholder: 'Component name',
                    validate: (value) => {
                        if (!value) return 'Please enter a component name.'

                        if (value.startsWith('.') || value.startsWith('/')) {
                            return 'Component name should not start with a dot or (. /)'
                        }
                    },
                })
            },
            tools: ({ results }) =>
                p.multiselect({
                    message: 'Select files to generate',
                    options:
                        results.type === 'backend'
                            ? [
                                  {
                                      value: 'index',
                                      label: 'Index',
                                      file: 'index.txt',
                                  },
                                  {
                                      value: 'entity',
                                      label: 'Entity',
                                      file: 'entity.txt',
                                  },
                                  {
                                      value: 'permissions',
                                      label: 'Permissions',
                                      file: 'permissions.txt',
                                  },
                                  {
                                      value: 'controller',
                                      label: 'Controller',
                                      file: 'controller.txt',
                                  },
                                  {
                                      value: 'seed',
                                      label: 'Seed',
                                      file: 'seed.txt',
                                  },
                              ]
                            : results.type === 'frontend'
                            ? [
                                  {
                                      value: 'index',
                                      label: 'Index',
                                  },
                                  {
                                      value: 'actions',
                                      label: 'actions',
                                  },
                                  {
                                      value: 'model',
                                      label: 'model',
                                  },
                                  {
                                      value: 'api',
                                      label: 'api',
                                  },
                              ]
                            : [
                                  {
                                      value: 'index.vue',
                                      label: 'index.vue',
                                  },
                              ],
                }),
            install: () =>
                p.confirm({
                    message: 'crete files?',
                    initialValue: true,
                }),
        },
        {
            onCancel: () => {
                p.cancel('Operation cancelled. 🤷')
                process.exit(0)
            },
        }
    )
    if (project.folder) {
        const folderPath = folderPathFunction(project)

        if (fs.existsSync(folderPath)) {
            const files = fs.readdirSync(folderPath)
            if (files.length > 0) {
                const confirm = await p.confirm({
                    message: `Folder ${color.bgRed(
                        color.white(project.folder)
                    )} has the following files already exist ${color.bgRed(
                        files.join(', ')
                    )} \n Do you want to overwrite them?`,
                    initialValue: false,
                })
                if (confirm) {
                    await generateFiles(project, pathToSourceFolder, folderPath)
                } else {
                    p.cancel(
                        'Cancel overwrite files: ' + files.join(', ') + '.'
                    )
                    p.outro('Bye bye')
                    process.exit(0)
                }
            }
        }
    }
    if (project.install) {
        // spinner
        const spinner = p.spinner()
        // getting folder path to create files in it based on project type 'backend' or 'frontend'
        const folderPath = folderPathFunction(project)
        // start spinner
        spinner.start('start to create files')
        await setTimeout(2000)
        // create folder if not exist
        fs.mkdirSync(folderPath, { recursive: true })
        // split project.folder by / and get last item
        await generateFiles(project, pathToSourceFolder, folderPath)
        // stop spinner
        spinner.stop('create files success 👍')
    } else {
        p.cancel('Operation cancelled. 🤷‍♂️')
        process.exit(0)
    }
    p.outro(`${color.underline(color.cyan('Happy Coding 😎'))}`)
}

main().catch((err) => console.log(err))
