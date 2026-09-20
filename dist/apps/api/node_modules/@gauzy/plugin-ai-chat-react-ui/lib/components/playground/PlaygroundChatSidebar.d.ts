/**
 * PlaygroundChatSidebar — standalone chat-only panel designed to render
 * inside a collapsible right sidebar (`nb-sidebar`). No settings panel.
 *
 * Wired to the Gauzy backend via the Vercel AI SDK (`useChat` from
 * @ai-sdk/react v4 / AI SDK 7): streams from `POST /api/ai-chat` with
 * the user's own JWT, using the tenant's default provider/model.
 * Includes a compact header with title and "New Chat" button.
 */
export declare function PlaygroundChatSidebar(): import("react/jsx-runtime").JSX.Element;
