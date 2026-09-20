import { PlaygroundChatSidebar } from './components/playground/PlaygroundChatSidebar';
import * as i0 from "@angular/core";
/**
 * PlaygroundChatSidebarComponent
 *
 * Angular standalone component that renders the chat-only playground
 * panel inside a dynamic right-side sidebar (`nb-sidebar`).
 * No settings panel — just the chat message list + input.
 *
 * Registered via `ChatSidebarService.register()` so it
 * appears as the dedicated chat panel in the layout's chat sidebar slot.
 */
export declare class PlaygroundChatSidebarComponent {
    readonly page: typeof PlaygroundChatSidebar;
    static ɵfac: i0.ɵɵFactoryDeclaration<PlaygroundChatSidebarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PlaygroundChatSidebarComponent, "gz-playground-chat-sidebar", never, {}, {}, never, never, true, never>;
}
