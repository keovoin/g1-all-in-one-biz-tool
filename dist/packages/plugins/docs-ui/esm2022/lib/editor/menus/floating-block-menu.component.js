import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NbButtonModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { Editor } from '@tiptap/core';
import { FloatingMenuPlugin } from '@tiptap/extension-floating-menu';
import { PluginKey } from '@tiptap/pm/state';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
const pluginKey = new PluginKey('gzFloatingBlockMenu');
/**
 * Empty-line "+" menu (spec 05 §6.5): a ghost plus button on empty paragraphs;
 * clicking it opens the slash menu programmatically at that block (inserts `/`).
 */
export class FloatingBlockMenuComponent {
    constructor() {
        /**
         * The `Editor` this component's ProseMirror plugin is currently registered against
         * — deliberately *not* read back off `this.editor`, which the parent re-points
         * before the teardown of the previous registration can run.
         */
        this.attached = null;
    }
    ngAfterViewInit() {
        this.attach();
    }
    /**
     * `DocumentEditorComponent.rebuildEditor()` (route `page/:id` change) destroys the
     * old `Editor` and builds the replacement **synchronously**, so the `*ngIf="editor"`
     * wrapping this component never goes falsy and this view is never torn down and
     * recreated — only the `[editor]` binding changes. Without re-registering here the
     * empty-line "+" never appears again after switching documents (spec 05 §6.5).
     */
    ngOnChanges(changes) {
        const change = changes['editor'];
        // The very first binding is registered by `ngAfterViewInit` instead: `ngOnChanges`
        // runs before `ngOnInit`, where the static view query for the menu element is
        // not guaranteed to be resolved yet.
        if (!change || change.firstChange)
            return;
        this.detach();
        this.attach();
    }
    ngOnDestroy() {
        this.detach();
    }
    attach() {
        const editor = this.editor;
        if (!editor || this.attached === editor)
            return;
        editor.registerPlugin(FloatingMenuPlugin({
            pluginKey,
            editor,
            element: this.menuRef.nativeElement,
            options: { placement: 'left', offset: 8 },
            shouldShow: ({ editor: active, state }) => {
                if (!active.isEditable)
                    return false;
                const { $anchor, empty } = state.selection;
                const isEmptyParagraph = $anchor.parent.type.name === 'paragraph' && $anchor.parent.content.size === 0;
                return empty && isEmptyParagraph;
            }
        }));
        this.attached = editor;
    }
    detach() {
        const editor = this.attached;
        if (!editor)
            return;
        this.attached = null;
        // A rebuild destroys the previous editor before this runs; its ProseMirror view
        // (and with it the plugin) is already gone.
        if (!editor.isDestroyed)
            editor.unregisterPlugin(pluginKey);
    }
    openSlashMenu() {
        this.editor.chain().focus().insertContent('/').run();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FloatingBlockMenuComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: FloatingBlockMenuComponent, isStandalone: true, selector: "gz-floating-block-menu", inputs: { editor: "editor" }, viewQueries: [{ propertyName: "menuRef", first: true, predicate: ["menu"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `
		<div class="gz-floating-menu" #menu>
			<button
				nbButton
				ghost
				size="tiny"
				type="button"
				class="gz-plus-button"
				[nbTooltip]="'DOCS.EDITOR.ADD_BLOCK' | translate"
				(click)="openSlashMenu()"
			>
				<nb-icon icon="plus-outline"></nb-icon>
			</button>
		</div>
	`, isInline: true, styles: [".gz-floating-menu{visibility:hidden}.gz-plus-button{opacity:.5}.gz-plus-button:hover{opacity:1}\n"], dependencies: [{ kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: NbTooltipModule }, { kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FloatingBlockMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-floating-block-menu', standalone: true, imports: [TranslateModule, NbButtonModule, NbIconModule, NbTooltipModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `
		<div class="gz-floating-menu" #menu>
			<button
				nbButton
				ghost
				size="tiny"
				type="button"
				class="gz-plus-button"
				[nbTooltip]="'DOCS.EDITOR.ADD_BLOCK' | translate"
				(click)="openSlashMenu()"
			>
				<nb-icon icon="plus-outline"></nb-icon>
			</button>
		</div>
	`, styles: [".gz-floating-menu{visibility:hidden}.gz-plus-button{opacity:.5}.gz-plus-button:hover{opacity:1}\n"] }]
        }], propDecorators: { editor: [{
                type: Input,
                args: [{ required: true }]
            }], menuRef: [{
                type: ViewChild,
                args: ['menu', { static: true }]
            }] } });
//# sourceMappingURL=floating-block-menu.component.js.map