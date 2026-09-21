"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMcpTools = createMcpTools;
const common_1 = require("@nestjs/common");
const esm_loader_1 = require("../esm-loader");
const logger = new common_1.Logger('AiChatMcpTools');
/**
 * Optionally attach the Gauzy MCP server's tools to the chat agent.
 *
 * Enabled by setting `GAUZY_AI_CHAT_MCP_URL` to the HTTP endpoint of a
 * running Gauzy MCP server. A fresh MCP client is created per chat request
 * and the requesting user's `Authorization` header is forwarded, so the
 * MCP server can act on behalf of that user.
 *
 * SECURITY NOTE: only enable this against an MCP server that validates and
 * uses the per-request bearer token for its own Gauzy API calls. An MCP
 * server logged in with a fixed service account would execute tools with
 * THAT account's permissions, bypassing the requesting user's RBAC.
 * See the plugin README for the current status of the bundled
 * `@gauzy/mcp-server` and this requirement.
 */
async function createMcpTools(authorizationHeader) {
    const url = process.env.GAUZY_AI_CHAT_MCP_URL;
    if (!url)
        return null;
    let client;
    try {
        const { createMCPClient } = await (0, esm_loader_1.importEsm)('@ai-sdk/mcp');
        client = await createMCPClient({
            transport: {
                type: 'http',
                url,
                headers: { Authorization: authorizationHeader }
            }
        });
        const tools = await client.tools();
        return {
            tools,
            close: async () => {
                try {
                    await client.close();
                }
                catch (error) {
                    logger.warn(`Failed to close MCP client: ${error}`);
                }
            }
        };
    }
    catch (error) {
        // MCP being down must not take chat down — degrade to built-in tools,
        // but never leak a half-initialized client.
        try {
            await client?.close?.();
        }
        catch {
            /* already logging the primary failure */
        }
        logger.warn(`MCP tools unavailable (${url}): ${error instanceof Error ? error.message : error}`);
        return null;
    }
}
//# sourceMappingURL=mcp-tools.js.map