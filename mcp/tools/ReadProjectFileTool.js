const fs = require('fs');
const path = require('path');
const { z } = require('zod');

function registerReadProjectFileTool(server) {

    server.registerTool(
        'read_project_file',

        {
            description: 'Read a text file from the PWT_EU project',

            inputSchema: z.object({
                filePath: z.string()
                    .describe('Relative path inside the PWT_EU project')
            })
        },

        async ({ filePath }) => {

            const projectRoot = process.cwd();

            const fullPath = path.resolve(
                projectRoot,
                filePath
            );

            // Security check:
            // prevent access outside PWT_EU
            if (!fullPath.startsWith(projectRoot)) {
                throw new Error(
                    'Access outside PWT_EU project is not allowed'
                );
            }

            if (!fs.existsSync(fullPath)) {
                throw new Error(
                    `File not found: ${filePath}`
                );
            }

            const content = fs.readFileSync(
                fullPath,
                'utf8'
            );

            return {
                content: [
                    {
                        type: 'text',
                        text: content
                    }
                ]
            };
        }
    );
}

module.exports = registerReadProjectFileTool;