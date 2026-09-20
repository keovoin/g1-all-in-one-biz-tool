import { OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import React from 'react';
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
export declare class ReactHostDirective implements OnInit, OnChanges, OnDestroy {
    private readonly host;
    private readonly injector;
    private root;
    gaReactHost: React.ComponentType<unknown>;
    props: Record<string, unknown>;
    context: Record<string, unknown>;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private render;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ReactHostDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ReactHostDirective, "[gaReactHost]", never, { "gaReactHost": { "alias": "gaReactHost"; "required": true; }; "props": { "alias": "props"; "required": false; }; "context": { "alias": "context"; "required": false; }; }, {}, never, never, true, never>;
}
