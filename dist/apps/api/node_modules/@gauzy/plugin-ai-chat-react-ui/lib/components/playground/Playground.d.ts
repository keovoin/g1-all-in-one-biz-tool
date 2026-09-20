import { type CSSProperties, type ReactNode } from 'react';
export interface PlaygroundProps {
    /** Title shown in the header bar. */
    title?: string;
    /** Extra content rendered inside the settings panel. */
    settingsExtra?: ReactNode;
    /** Content rendered inside the chat panel header. */
    chatHeader?: ReactNode;
    /** Custom placeholder for the chat input. */
    inputPlaceholder?: string;
    /** Optional outer style overrides. */
    style?: CSSProperties;
}
/**
 * Playground — full AI chat playground wired to the Gauzy backend.
 *
 * Renders a settings panel (model selector, system prompt, parameter
 * sliders) on the left and a streaming chat panel on the right.
 *
 * Built on the Vercel AI SDK (`useChat` from @ai-sdk/react v4 / AI SDK 7):
 * - loads available providers/models from `GET /api/ai-chat/config`
 *   (only configured providers are offered; defaults are preselected);
 * - streams from `POST /api/ai-chat` with the user's own JWT, passing
 *   the selected `providerId` / `modelId` in the request body;
 * - the system prompt editor and parameter sliders are shown but
 *   disabled — the backend builds its own system prompt and does not
 *   accept temperature / topP / maxTokens yet.
 */
export declare function Playground({ title, settingsExtra, chatHeader, inputPlaceholder, style }: PlaygroundProps): import("react/jsx-runtime").JSX.Element;
