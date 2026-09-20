import { OnDestroy, OnInit } from '@angular/core';
import React from 'react';
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
export declare class LazyReactHostDirective implements OnInit, OnDestroy {
    private readonly host;
    private readonly injector;
    private root;
    gaReactLazyHost: () => Promise<{
        default: React.ComponentType<unknown>;
    }>;
    props: Record<string, unknown>;
    /** Extra context merged with injector (accessible via useBridgeContext) */
    context: Record<string, unknown>;
    ngOnInit(): Promise<void>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LazyReactHostDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<LazyReactHostDirective, "[gaReactLazyHost]", never, { "gaReactLazyHost": { "alias": "gaReactLazyHost"; "required": true; }; "props": { "alias": "props"; "required": false; }; "context": { "alias": "context"; "required": false; }; }, {}, never, never, true, never>;
}
