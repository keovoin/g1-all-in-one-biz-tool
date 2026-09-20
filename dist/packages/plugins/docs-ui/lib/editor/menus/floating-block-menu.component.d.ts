import { AfterViewInit, ElementRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Editor } from '@tiptap/core';
import * as i0 from "@angular/core";
/**
 * Empty-line "+" menu (spec 05 §6.5): a ghost plus button on empty paragraphs;
 * clicking it opens the slash menu programmatically at that block (inserts `/`).
 */
export declare class FloatingBlockMenuComponent implements AfterViewInit, OnChanges, OnDestroy {
    editor: Editor;
    menuRef: ElementRef<HTMLElement>;
    /**
     * The `Editor` this component's ProseMirror plugin is currently registered against
     * — deliberately *not* read back off `this.editor`, which the parent re-points
     * before the teardown of the previous registration can run.
     */
    private attached;
    ngAfterViewInit(): void;
    /**
     * `DocumentEditorComponent.rebuildEditor()` (route `page/:id` change) destroys the
     * old `Editor` and builds the replacement **synchronously**, so the `*ngIf="editor"`
     * wrapping this component never goes falsy and this view is never torn down and
     * recreated — only the `[editor]` binding changes. Without re-registering here the
     * empty-line "+" never appears again after switching documents (spec 05 §6.5).
     */
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private attach;
    private detach;
    openSlashMenu(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FloatingBlockMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FloatingBlockMenuComponent, "gz-floating-block-menu", never, { "editor": { "alias": "editor"; "required": true; }; }, {}, never, never, true, never>;
}
