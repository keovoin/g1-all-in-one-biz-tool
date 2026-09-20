import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactHostDirective } from '@gauzy/ui-react';
import { Playground } from './components/playground/Playground';
import * as i0 from "@angular/core";
/**
 * PlaygroundPageComponent
 *
 * Angular standalone component used as the routed entry point for
 * the `/pages/playground` route. Mounts the React `Playground`
 * component via ReactHostDirective, filling the full page height.
 */
export class PlaygroundPageComponent {
    constructor() {
        this.page = Playground;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PlaygroundPageComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: PlaygroundPageComponent, isStandalone: true, selector: "gz-ai-playground-page", ngImport: i0, template: `<div [gaReactHost]="page" style="display:flex;flex-direction:column;height:100%"></div>`, isInline: true, styles: [":host{display:flex;flex-direction:column;flex:1;overflow:hidden;height:100%}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: ReactHostDirective, selector: "[gaReactHost]", inputs: ["gaReactHost", "props", "context"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PlaygroundPageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-ai-playground-page', imports: [CommonModule, ReactHostDirective], template: `<div [gaReactHost]="page" style="display:flex;flex-direction:column;height:100%"></div>`, changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{display:flex;flex-direction:column;flex:1;overflow:hidden;height:100%}\n"] }]
        }] });
//# sourceMappingURL=playground-page.component.js.map