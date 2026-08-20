async function run() {

    // MCP v2 uses ESM package exports.
    // Dynamic import lets us keep PWT_EU as CommonJS.
    const { Client } =
        await import('@modelcontextprotocol/client');

    const { StdioClientTransport } =
        await import('@modelcontextprotocol/client/stdio');


    const client = new Client({
        name: 'pwt-eu-mcp-test-client',
        version: '1.0.0'
    });


    const transport = new StdioClientTransport({
        command: 'node',
        args: ['mcp/PwtMcpServer.js']
    });


    console.log('Connecting to PWT_EU MCP Server...');

    await client.connect(transport);

    console.log('Connected to PWT_EU MCP Server');


    // ---------------------------------------
    // List MCP tools
    // ---------------------------------------

    const tools = await client.listTools();

    console.log('\nAvailable MCP Tools:');

    for (const tool of tools.tools) {
        console.log(`- ${tool.name}`);
    }


    // ---------------------------------------
    // Call our MCP tool
    // ---------------------------------------

    console.log('\nCalling read_project_file...');

    const result = await client.callTool({
        name: 'read_project_file',

        arguments: {
            filePath: 'pages/CartPage.js'
        }
    });


    console.log('\nMCP TOOL RESULT');
    console.log('----------------------------------');


    for (const item of result.content) {

        if (item.type === 'text') {
            console.log(item.text);
        }
    }


    await client.close();

    console.log('\nMCP Client closed successfully.');
}


run().catch(error => {

    console.error('\nMCP CLIENT ERROR:');
    console.error(error);

});