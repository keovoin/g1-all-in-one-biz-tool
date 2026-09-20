import { AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { ComponentEnum } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
export declare class GauzyButtonActionComponent implements AfterViewInit, OnDestroy {
    /** Marks the block holding these buttons as the page header's action slot. */
    private static readonly PAGE_HEADER_ACTIONS_CLASS;
    /** Whether the action buttons are disabled / hidden. */
    readonly isDisable: import("@angular/core").InputSignal<boolean>;
    /** Whether the layout selector toggle is shown. */
    readonly hasLayoutSelector: import("@angular/core").InputSignal<boolean>;
    /** The component name passed to the layout selector. */
    readonly componentName: import("@angular/core").InputSignal<ComponentEnum>;
    /** Template reference for the primary action button. */
    readonly buttonTemplate: import("@angular/core").InputSignal<TemplateRef<unknown>>;
    /** Template reference for the visible-state button. */
    readonly buttonTemplateVisible: import("@angular/core").InputSignal<TemplateRef<unknown>>;
    private readonly elementRef;
    private readonly renderer;
    /** Element marked as the action slot, so the mark can be removed on destroy. */
    private actionSlot;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * Marks the card-header block these buttons sit in, so the header can lay it
     * out on the page title's line rather than on a row of its own (see
     * `.ga-page-header` in `ui-core/static/styles/_overrides.scss`; the title side
     * is marked by `HeaderTitleComponent`, which also decides whether the header
     * takes part at all).
     *
     * The mark is applied from here, and not by the header title, because several
     * pages wrap this block in an `@if` — it has to come back with the block.
     * Outside a card header (a tab strip, a card body) there is nothing to mark.
     */
    private markPageHeaderActions;
    static ɵfac: i0.ɵɵFactoryDeclaration<GauzyButtonActionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GauzyButtonActionComponent, "ngx-gauzy-button-action", never, { "isDisable": { "alias": "isDisable"; "required": false; "isSignal": true; }; "hasLayoutSelector": { "alias": "hasLayoutSelector"; "required": false; "isSignal": true; }; "componentName": { "alias": "componentName"; "required": false; "isSignal": true; }; "buttonTemplate": { "alias": "buttonTemplate"; "required": false; "isSignal": true; }; "buttonTemplateVisible": { "alias": "buttonTemplateVisible"; "required": false; "isSignal": true; }; }, {}, never, ["[buttonTemplateVisible]", "[buttonTemplate]"], false, never>;
}
