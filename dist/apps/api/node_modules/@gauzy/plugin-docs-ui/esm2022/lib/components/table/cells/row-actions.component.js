import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
/**
 * Actions column renderer (`01-ux-spec.md` §4.1, column 9): a kebab opening the
 * same action set as the tree context menu, plus Details and (for a FILE)
 * Preview.
 *
 * The cell renders only — the items are built by `DocsTableComponent` from the
 * shared `buildDocsActionMenu()`, and clicks come back through the table's own
 * `NbMenuService` subscription (one subscription for the page, keyed by the tag
 * prefix, rather than one per rendered row).
 */
export class RowActionsComponent {
    constructor() {
        /** Prebuilt, permission-filtered items (see `docs-action-menu.ts`). */
        this.menuItems = [];
        /** `<prefix><documentId>` — the table resolves the row from it. */
        this.tag = '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RowActionsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: RowActionsComponent, isStandalone: false, selector: "gz-docs-row-actions", inputs: { rowData: "rowData", menuItems: "menuItems", tag: "tag" }, ngImport: i0, template: `
		<button
			*ngIf="menuItems?.length"
			nbButton
			ghost
			size="tiny"
			type="button"
			class="docs-row-actions"
			[nbContextMenu]="menuItems"
			[nbContextMenuTag]="tag"
			(click)="$event.stopPropagation()"
			[attr.aria-label]="'DOCS.A11Y.NODE_ACTIONS' | translate"
		>
			<nb-icon icon="more-horizontal-outline" size="tiny"></nb-icon>
		</button>
	`, isInline: true, styles: [".docs-row-actions{padding:.125rem .25rem}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i2.NbContextMenuDirective, selector: "[nbContextMenu]", inputs: ["nbContextMenuPlacement", "nbContextMenuAdjustment", "nbContextMenuTag", "nbContextMenu", "nbContextMenuTrigger", "nbContextMenuClass"] }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RowActionsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-row-actions', template: `
		<button
			*ngIf="menuItems?.length"
			nbButton
			ghost
			size="tiny"
			type="button"
			class="docs-row-actions"
			[nbContextMenu]="menuItems"
			[nbContextMenuTag]="tag"
			(click)="$event.stopPropagation()"
			[attr.aria-label]="'DOCS.A11Y.NODE_ACTIONS' | translate"
		>
			<nb-icon icon="more-horizontal-outline" size="tiny"></nb-icon>
		</button>
	`, standalone: false, styles: [".docs-row-actions{padding:.125rem .25rem}\n"] }]
        }], propDecorators: { rowData: [{
                type: Input
            }], menuItems: [{
                type: Input
            }], tag: [{
                type: Input
            }] } });
//# sourceMappingURL=row-actions.component.js.map