import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";


const server = new McpServer({
// has to be the name the project was initialized with - can be edited in package.json
    name: "tutorial",
    version: "1.0.0",
    capabilities: {
        resources:{},
        tools:{},
        prompts:{}
    }
})

async function main() {
// Transport can be StdioServerTransport (console log standard input and output, only used locally), http streaming and server sent events (deprecated)
const transport = new StdioServerTransport()
await server.connect(transport)
}

main()


