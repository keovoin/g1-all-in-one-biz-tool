import * as i0 from "@angular/core";
/**
 * AiChatWindowComponent
 *
 * Routed entry point of the DETACHED chat window (`/ai-chat/window`), opened
 * with `window.open` from `ChatSidebarService.detach()` so the user can drag
 * the chat onto another monitor.
 *
 * It renders {@link AiChatSidebarComponent} — the very same panel the docked
 * chat sidebar renders — so there is exactly one chat implementation. The
 * route is registered at the app root, outside the `/pages` shell, which is
 * what keeps the nav menu sidebar, header and footer off this window.
 */
export declare class AiChatWindowComponent {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<AiChatWindowComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AiChatWindowComponent, "gz-ai-chat-window", never, {}, {}, never, never, true, never>;
}
