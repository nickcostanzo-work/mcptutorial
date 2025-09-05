import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// imported as promise base fs
import fs from "node:fs/promises"


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

// SERVER TOOLS ALLOWS YOU TO PASS THE FUNCTION NAME AND A DESCRIPTIONI OF THE TOOL FOR THE AI TO USE
server.tool("create-user", "Create a new user in the database", {
    // USING ZOD MODULE FOR PARAMETERS
    // TOOL KNOWS PARAMETERS BASED ON THIS PART OF THE CODE
    name: z.string(),
    email: z.string(),
    address: z.string(),
    phone: z.string()
}, {
    // annotation function - hits for the AI to tell it what to do
    title: "Create User",
    readOnlyHint: false,
    // You can tell AI if the tool is going to do something like delete or edit data
    destructiveHint: false,
    // Is this a pure function or not?
    idempotentHint: false,
    // Open world hint - does it need to interact with somethng externnal to itself
    openWorldHint: true
}, async (params) => {
// Pass along what the function of the tool is going to do
    try {
    const id = await createUser(params)

    return {
        content: [
            { type: "text", text: `User created with id ${id}`}
        ]
    }
    } catch {
        return {
            content: [
                { type: "text", text: "Failed to save user" }
            ]
        }
    }
})

async function createUser(user: {
    name: string,
    email: string,
    address: string,
    phone: string
}) {
    const users = await import("./data/users.json", {
        with: { type: "json" }
    }).then(m => m.default)

    const id = users.length + 1

    users.push({id, ...user})

    await fs.writeFile("./src/data/users.json", JSON.stringify(users, null, 2))

    return id
} 


async function main() {
// Transport can be StdioServerTransport (console log standard input and output, only used locally), http streaming and server sent events (deprecated)
const transport = new StdioServerTransport()
await server.connect(transport)
}



main()


