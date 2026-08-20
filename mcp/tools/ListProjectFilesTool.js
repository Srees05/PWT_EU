const fs = require('fs');
const path = require('path');
const { z } = require('zod');

function registerListProjectFilesTool(server) {

    server.registerTool(
        'list_project_files',

        {
            description:
                'List files inside an approved PWT_EU project directory',

            inputSchema: z.object({

                directory: z.string()
                    .describe(
                        'Relative project directory such as tests, pages, config or results'
                    )
            })
        },

        async ({ directory }) => {

            const projectRoot = process.cwd();

            const fullPath = path.resolve(
                projectRoot,
                directory
            );

            const relative = path.relative(
                projectRoot,
                fullPath
            );

            if (
                relative.startsWith('..') ||
                path.isAbsolute(relative)
            ) {
                throw new Error(
                    'Access outside PWT_EU is not allowed'
                );
            }

            if (!fs.existsSync(fullPath)) {
                throw new Error(
                    `Directory not found: ${directory}`
                );
            }

            if (!fs.statSync(fullPath).isDirectory()) {
                throw new Error(
                    `${directory} is not a directory`
                );
            }

            const files = fs.readdirSync(
                fullPath,
                {
                    withFileTypes: true
                }
            );

            const output = files.map(item => {

                const type =
                    item.isDirectory()
                        ? '[DIR]'
                        : '[FILE]';

                return `${type} ${item.name}`;

            }).join('\n');

            return {
                content: [
                    {
                        type: 'text',
                        text:
                            output ||
                            'Directory is empty'
                    }
                ]
            };
        }
    );
}

module.exports = registerListProjectFilesTool;