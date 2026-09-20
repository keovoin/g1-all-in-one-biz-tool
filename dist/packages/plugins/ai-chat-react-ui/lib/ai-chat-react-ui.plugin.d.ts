/**
 * AI Chat React UI Plugin Definition.
 *
 * Self-contained plugin that registers:
 * - An AI Playground page at `/pages/playground` (Vercel AI SDK style)
 * - A per-tenant "AI Providers" (BYOK) settings page at `/pages/settings/ai`
 *   with a nav item under the core Settings section (AI_CHAT_SETTINGS permission)
 * - The AI Chat panel in the layout's dedicated chat sidebar slot
 *   (`Menu | Chat | Page content`)
 *
 * Uses `defineDeclarativePlugin` with `providers` for the chat sidebar
 * and declarative `routes` for the playground page. No external provider
 * (e.g. in `bootstrap.module.ts`) is needed.
 *
 * The chat talks to the `@gauzy/plugin-ai-chat` backend plugin
 * (`POST /api/ai-chat`, Vercel AI SDK UI message stream).
 */
export declare const AiChatReactUiPlugin: import("@gauzy/plugin-ui").PluginUiDefinition;
