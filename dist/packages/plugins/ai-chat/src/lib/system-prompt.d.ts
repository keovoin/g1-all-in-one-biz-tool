/**
 * Builds the system instructions for the embedded Gauzy AI agent.
 *
 * The prompt grounds the model in the requesting user's identity and
 * context (name, role, organization, tenant, date) and explains the two
 * tool families:
 * - server tools that call the Gauzy REST API *as the user* (RBAC and
 *   tenant isolation are enforced by the API itself), and
 * - client tools that drive the UI next to the chat (open pages, read
 *   and fill forms) — the "canvas".
 */
export interface ISystemPromptContext {
    userName?: string;
    roleName?: string;
    organizationName?: string;
    tenantName?: string;
    employeeId?: string;
    permissions?: string[];
    languageCode?: string;
}
export declare function buildSystemPrompt(context: ISystemPromptContext): string;
