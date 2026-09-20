import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactHostDirective } from '@gauzy/ui-react';
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
export class PlaygroundChatSidebarComponent {
    constructor() {
        this.page = PlaygroundChatSidebar;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PlaygroundChatSidebarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: PlaygroundChatSidebarComponent, isStandalone: true, selector: "gz-playground-chat-sidebar", ngImport: i0, template: `<div [gaReactHost]="page" style="display:flex;flex-direction:column;height:100%"></div>`, isInline: true, styles: [":host{display:flex;flex-direction:column;flex:1;overflow:hidden;height:100%}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: ReactHostDirective, selector: "[gaReactHost]", inputs: ["gaReactHost", "props", "context"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PlaygroundChatSidebarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-playground-chat-sidebar', imports: [CommonModule, ReactHostDirective], template: `<div [gaReactHost]="page" style="display:flex;flex-direction:column;height:100%"></div>`, changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{display:flex;flex-direction:column;flex:1;overflow:hidden;height:100%}\n"] }]
        }] });
//# sourceMappingURL=playground-chat-sidebar.component.js.map