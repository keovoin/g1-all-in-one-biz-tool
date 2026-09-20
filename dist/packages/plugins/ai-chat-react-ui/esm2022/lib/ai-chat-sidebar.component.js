import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactHostDirective } from '@gauzy/ui-react';
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
export class AiChatSidebarComponent {
    constructor() {
        this.page = AiChatPanel;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AiChatSidebarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: AiChatSidebarComponent, isStandalone: true, selector: "gz-ai-chat-sidebar", ngImport: i0, template: `<div
		[gaReactHost]="page"
		style="display:flex;flex-direction:column;height:100%;width:100%;min-width:0;max-width:100%;overflow:hidden"
	></div>`, isInline: true, styles: [":host{display:flex;flex-direction:column;flex:1;overflow:hidden;width:100%;min-width:0;max-width:100%}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: ReactHostDirective, selector: "[gaReactHost]", inputs: ["gaReactHost", "props", "context"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AiChatSidebarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-ai-chat-sidebar', imports: [CommonModule, ReactHostDirective], template: `<div
		[gaReactHost]="page"
		style="display:flex;flex-direction:column;height:100%;width:100%;min-width:0;max-width:100%;overflow:hidden"
	></div>`, changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{display:flex;flex-direction:column;flex:1;overflow:hidden;width:100%;min-width:0;max-width:100%}\n"] }]
        }] });
//# sourceMappingURL=ai-chat-sidebar.component.js.map