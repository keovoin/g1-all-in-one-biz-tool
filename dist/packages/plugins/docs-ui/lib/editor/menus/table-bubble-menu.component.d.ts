import { AfterViewInit, ElementRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Editor } from '@tiptap/core';
import * as i0 from "@angular/core";
/**
 * Table chrome (spec 05 §6.7 — must-build): the free table extensions provide
 * model + commands but no UI. Bubble menu anchored above the active table with
 * row/column ops, header toggles, merge/split (enabled via `can()`), and
 * delete-table (undoable, no confirm).
 */
export declare class TableBubbleMenuComponent implements AfterViewInit, OnChanges, OnDestroy {
    editor: Editor;
    menuRef: ElementRef<HTMLElement>;
    private readonly cdr;
    private readonly zone;
    private readonly onTransaction;
    /**
     * The `Editor` this component's ProseMirror plugin and listener are currently
     * registered against — deliberately *not* read back off `this.editor`, which the
     * parent re-points before the teardown of the previous registration can run.
     */
    private attached;
    get canMerge(): boolean;
    get canSplit(): boolean;
    ngAfterViewInit(): void;
    /**
     * `DocumentEditorComponent.rebuildEditor()` (route `page/:id` change) destroys the
     * old `Editor` and builds the replacement **synchronously**, so the `*ngIf="editor"`
     * wrapping this component never goes falsy and this view is never torn down and
     * recreated — only the `[editor]` binding changes. Without re-registering here the
     * table chrome stays bound to a destroyed editor and never appears again after
     * switching documents (spec 05 §6.7).
     */
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private attach;
    private detach;
    exec(command: 'addRowBefore' | 'addRowAfter' | 'deleteRow' | 'addColumnBefore' | 'addColumnAfter' | 'deleteColumn' | 'toggleHeaderRow' | 'toggleHeaderColumn' | 'mergeCells' | 'splitCell' | 'deleteTable'): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TableBubbleMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TableBubbleMenuComponent, "gz-table-bubble-menu", never, { "editor": { "alias": "editor"; "required": true; }; }, {}, never, never, true, never>;
}
