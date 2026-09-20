export interface IMcpToolsHandle {
    tools: Record<string, unknown>;
    close: () => Promise<void>;
}
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
export declare function createMcpTools(authorizationHeader: string): Promise<IMcpToolsHandle | null>;
