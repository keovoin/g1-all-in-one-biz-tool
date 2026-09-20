import { EnvironmentProviders } from '@angular/core';
/**
 * Registers the AI Chat panel as a dedicated sidebar rendered
 * in the layout's chat sidebar slot (between the menu sidebar
 * and the main content area): `Menu | Chat | Page content`.
 *
 * Also:
 * - seeds the agent page registry (pages the agent may open in the canvas);
 * - keeps `ChatSidebarService.available` in sync with the verdict of
 *   {@link AiChatAvailabilityService} (permission + `GET /api/ai-chat/config`)
 *   — the layout and the header toggle only show the chat when it is true.
 *
 * The verdict deliberately lives in a shared service rather than here: the
 * "AI Providers" settings page reads the very same verdict to explain the chat
 * to the user, and forces a re-evaluation after a credential changes so the
 * first configured provider turns the chat on without a page reload.
 *
 * @example
 * ```typescript
 * providers: [provideAiChatSidebar()]
 * ```
 */
export declare function provideAiChatSidebar(): EnvironmentProviders;
