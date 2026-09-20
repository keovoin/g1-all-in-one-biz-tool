import { AiChatPanel } from './components/AiChatPanel';
import * as i0 from "@angular/core";
/**
 * AiChatSidebarComponent
 *
 * Angular standalone component that bridges the React-based AI Chat
 * panel into the Angular layout via ReactHostDirective.
 *
 * Rendered inside a dedicated `nb-sidebar` (tag: 'chat-sidebar')
 * positioned between the nav menu sidebar and the main page content.
 */
export declare class AiChatSidebarComponent {
    readonly page: typeof AiChatPanel;
    static ɵfac: i0.ɵɵFactoryDeclaration<AiChatSidebarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AiChatSidebarComponent, "gz-ai-chat-sidebar", never, {}, {}, never, never, true, never>;
}
