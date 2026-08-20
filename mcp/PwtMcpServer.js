async function startServer() {

    const { McpServer } =
        await import('@modelcontextprotocol/server');

    const { StdioServerTransport } =
        await import('@modelcontextprotocol/server/stdio');

    const registerReadProjectFileTool =
        require('./tools/ReadProjectFileTool');

    const registerListProjectFilesTool =
        require('./tools/ListProjectFilesTool');


    const server = new McpServer({
        name: 'pwt-eu-mcp-server',
        version: '1.0.0'
    });


    // Register MCP tools
    registerReadProjectFileTool(server);

    registerListProjectFilesTool(server);


    const transport =
        new StdioServerTransport();


    console.error(
        'PWT_EU MCP Server started'
    );


    await server.connect(transport);
}


startServer().catch(error => {

    console.error(
        'MCP Server failed:',
        error
    );

    process.exit(1);
});