import { Directive, ElementRef, inject, Injector, Input } from '@angular/core';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { NgContextProvider } from '../ng-react-context';
import * as i0 from "@angular/core";
/**
 * Directive that lazy-loads a React component via dynamic import and renders it.
 * Use for code-splitting: React chunks are loaded only when the directive is used.
 *
 * @example
 * ```html
 * <div
 *   [gaReactLazyHost]="loadKanban"
 *   [props]="kanbanProps">
 * </div>
 * ```
 *
 * ```ts
 * loadKanban = () => import('./kanban/KanbanBoard').then(m => m);
 * kanbanProps = { columns: this.columns };
 * ```
 */
export class LazyReactHostDirective {
    constructor() {
        this.host = inject(ElementRef);
        this.injector = inject(Injector);
        this.root = null;
        this.props = {};
        /** Extra context merged with injector (accessible via useBridgeContext) */
        this.context = {};
    }
    async ngOnInit() {
        const module = await this.gaReactLazyHost();
        const Component = module.default;
        if (!Component) {
            console.error('LazyReactDirective: module.default is not a React component');
            return;
        }
        this.root = createRoot(this.host.nativeElement);
        const componentProps = this.props ?? {};
        const bridgeContext = this.context ?? {};
        this.root.render(React.createElement(NgContextProvider, { injector: this.injector, context: bridgeContext }, React.createElement(Component, componentProps)));
    }
    ngOnDestroy() {
        this.root?.unmount();
        this.root = null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LazyReactHostDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: LazyReactHostDirective, isStandalone: true, selector: "[gaReactLazyHost]", inputs: { gaReactLazyHost: "gaReactLazyHost", props: "props", context: "context" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LazyReactHostDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[gaReactLazyHost]',
                    standalone: true
                }]
        }], propDecorators: { gaReactLazyHost: [{
                type: Input,
                args: [{ required: true }]
            }], props: [{
                type: Input
            }], context: [{
                type: Input
            }] } });
//# sourceMappingURL=react-lazy-host.directive.js.map