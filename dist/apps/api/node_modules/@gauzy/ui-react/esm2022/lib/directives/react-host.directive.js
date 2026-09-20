import { Directive, ElementRef, Injector, inject, Input } from '@angular/core';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { NgContextProvider } from '../ng-react-context';
import * as i0 from "@angular/core";
/**
 * Directive that renders a React component inside an Angular template.
 * The component receives the Angular injector via context and can use useInjector().
 *
 * @example
 * ```html
 * <div [gaReactHost]="MyReactComponent" [props]="componentProps"></div>
 * ```
 *
 * With extra context:
 * ```html
 * <div [gaReactHost]="KanbanBoard" [props]="props" [context]="ctx"></div>
 * ```
 */
export class ReactHostDirective {
    constructor() {
        this.host = inject(ElementRef);
        this.injector = inject(Injector);
        this.root = null;
        this.props = {};
        this.context = {};
    }
    ngOnInit() {
        this.root = createRoot(this.host.nativeElement);
        this.render();
    }
    ngOnChanges(changes) {
        if (this.root && (changes['gaReactHost'] || changes['props'] || changes['context'])) {
            this.render();
        }
    }
    render() {
        if (!this.root || !this.gaReactHost)
            return;
        const Component = this.gaReactHost;
        const componentProps = this.props ?? {};
        const bridgeContext = this.context ?? {};
        this.root.render(React.createElement(NgContextProvider, { injector: this.injector, context: bridgeContext }, React.createElement(Component, componentProps)));
    }
    ngOnDestroy() {
        this.root?.unmount();
        this.root = null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ReactHostDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: ReactHostDirective, isStandalone: true, selector: "[gaReactHost]", inputs: { gaReactHost: "gaReactHost", props: "props", context: "context" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ReactHostDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[gaReactHost]',
                    standalone: true
                }]
        }], propDecorators: { gaReactHost: [{
                type: Input,
                args: [{ required: true }]
            }], props: [{
                type: Input
            }], context: [{
                type: Input
            }] } });
//# sourceMappingURL=react-host.directive.js.map