import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChatSidebarService } from '@gauzy/ui-core/core';
import { AiChatSidebarComponent } from './ai-chat-sidebar.component';
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
export class AiChatWindowComponent {
    constructor() {
        // Tell the shared panel it is running standalone: the dock-side,
        // maximize, collapse, detach and drag-to-resize controls describe a
        // docked sidebar that does not exist in this window.
        inject(ChatSidebarService).detachedView.set(true);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AiChatWindowComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: AiChatWindowComponent, isStandalone: true, selector: "gz-ai-chat-window", ngImport: i0, template: `<gz-ai-chat-sidebar></gz-ai-chat-sidebar>`, isInline: true, styles: [":host{display:flex;flex-direction:column;height:100vh;width:100%;min-width:0;overflow:hidden;--gz-chat-surface: var(--background-basic-color-1, Canvas)}\n"], dependencies: [{ kind: "component", type: AiChatSidebarComponent, selector: "gz-ai-chat-sidebar" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AiChatWindowComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-ai-chat-window', imports: [AiChatSidebarComponent], template: `<gz-ai-chat-sidebar></gz-ai-chat-sidebar>`, changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{display:flex;flex-direction:column;height:100vh;width:100%;min-width:0;overflow:hidden;--gz-chat-surface: var(--background-basic-color-1, Canvas)}\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=ai-chat-window.component.js.map