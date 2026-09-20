import type { Tool } from 'ai';
/**
 * Client-executed tools — declared on the server (so the model can call
 * them) but WITHOUT `execute`: the AI SDK forwards the calls to the
 * browser, where the chat panel runs them against the Angular app
 * (router navigation, DOM form bridge) and streams the results back.
 *
 * `submit_form` and other mutating actions additionally require the
 * user's explicit approval (see `toolApproval` in the chat service).
 */
export declare function buildClientTools(): Promise<Record<string, Tool>>;
/** Names of client tools that must never run without user approval. */
export declare const CLIENT_TOOLS_REQUIRING_APPROVAL: readonly ["submit_form"];
