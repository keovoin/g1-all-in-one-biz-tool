/**
 * AiChatPanel
 *
 * Full-height AI agent chat panel rendered in the dedicated chat sidebar
 * slot: `Menu | Chat | Page content (canvas)`.
 *
 * Built on the Vercel AI SDK (`useChat` from @ai-sdk/react v4 / AI SDK 7):
 * - streams from the Gauzy backend (`POST /api/ai-chat`) with the user's
 *   own JWT, so the agent can only see and do what the user can;
 * - executes client ("canvas") tools in the browser — open_page /
 *   read_page / fill_form / submit_form — via the Angular bridge services;
 * - renders tool-approval requests inline (Approve / Reject) and resumes
 *   the run automatically once tool results or approvals are complete.
 */
export declare function AiChatPanel(): import("react/jsx-runtime").JSX.Element;
