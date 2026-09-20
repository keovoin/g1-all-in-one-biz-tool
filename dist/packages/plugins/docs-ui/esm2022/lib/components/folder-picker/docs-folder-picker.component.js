import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DocumentKindEnum } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentTreeStore } from '../../services/document-tree.store';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "../../services/document-tree.store";
import * as i3 from "@angular/common";
import * as i4 from "@angular/forms";
import * as i5 from "@nebular/theme";
/**
 * Flattened destination tree with a search box, shared by the Move dialog
 * (`01-ux-spec.md` §10.6) and the upload dialog's Destination field (§7.2) —
 * one picker, one set of rules, so "where does this go?" looks and behaves the
 * same wherever it is asked.
 *
 * Drop rules mirror the tree's `allowDrop`: FILE nodes are leaves, and nothing
 * may target a document being moved or anything inside it (`excludeIds`). The
 * upload dialog passes no `excludeIds` — a new file has no subtree to fall into.
 */
export class DocsFolderPickerComponent extends TranslationBaseComponent {
    constructor(translateService, treeStore) {
        super(translateService);
        this.translateService = translateService;
        this.treeStore = treeStore;
        /** Documents that must not be offered as a destination (move source + its subtree). */
        this.excludeIds = [];
        /** `undefined` = nothing chosen yet; `null` = the root. */
        this.selectedId = undefined;
        this.selectedIdChange = new EventEmitter();
        this.destinations = [];
        this.search = '';
    }
    ngOnInit() {
        void this.loadDestinations();
    }
    get filtered() {
        const query = this.search.trim().toLowerCase();
        if (!query)
            return this.destinations;
        return this.destinations.filter((destination) => destination.name.toLowerCase().includes(query));
    }
    isSelected(destination) {
        return this.selectedId !== undefined && destination.id === this.selectedId;
    }
    select(destination) {
        if (destination.disabled)
            return;
        this.selectedId = destination.id;
        this.selectedIdChange.emit(destination.id);
    }
    /**
     * Builds the destination list.
     *
     * 🛑 **Never rejects.** `loadRoots()` carries no internal catch, so a failed tree
     * fetch would be an unhandled rejection *and* leave `destinations` empty — the
     * picker would then offer nothing selectable at all, not even the root.
     */
    async loadDestinations() {
        const root = {
            id: null,
            name: this.getTranslation('DOCS.CARDS.BREADCRUMB_ROOT'),
            depth: 0,
            disabled: false
        };
        try {
            const roots = await this.treeStore.loadRoots();
            this.destinations = [root, ...this.flatten(roots, 1)];
        }
        catch {
            // The tree is unavailable — the root is still a valid destination.
            this.destinations = [root];
        }
    }
    flatten(nodes, depth) {
        const excluded = new Set((this.excludeIds ?? []).map(String));
        const result = [];
        for (const node of nodes) {
            // Same rules as tree allowDrop: FILE nodes are leaves; never into an excluded subtree.
            if (node.kind === DocumentKindEnum.FILE)
                continue;
            const inExcludedSubtree = (this.excludeIds ?? []).some((id) => this.treeStore.isDescendantOf(node.id, id));
            result.push({
                id: node.id,
                name: node.name,
                depth,
                disabled: excluded.has(String(node.id)) || inExcludedSubtree
            });
            if (node.children?.length) {
                result.push(...this.flatten(node.children, depth + 1));
            }
        }
        return result;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsFolderPickerComponent, deps: [{ token: i1.TranslateService }, { token: i2.DocumentTreeStore }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsFolderPickerComponent, isStandalone: false, selector: "gz-docs-folder-picker", inputs: { excludeIds: "excludeIds", selectedId: "selectedId" }, outputs: { selectedIdChange: "selectedIdChange" }, usesInheritance: true, ngImport: i0, template: `
		<input
			nbInput
			fullWidth
			size="small"
			type="text"
			[placeholder]="'DOCS.DIALOGS.MOVE_SEARCH' | translate"
			[attr.aria-label]="'DOCS.DIALOGS.MOVE_SEARCH' | translate"
			[(ngModel)]="search"
		/>
		<div class="docs-folder-picker-list">
			<button
				*ngFor="let destination of filtered"
				type="button"
				class="docs-folder-picker-item"
				[class.selected]="isSelected(destination)"
				[disabled]="destination.disabled"
				[style.padding-left.rem]="0.5 + destination.depth * 1"
				(click)="select(destination)"
			>
				<nb-icon [icon]="destination.id ? 'folder-outline' : 'home-outline'" size="tiny"></nb-icon>
				{{ destination.name }}
			</button>
		</div>
	`, isInline: true, styles: [".docs-folder-picker-list{max-height:40vh;overflow-y:auto;margin:.75rem 0;display:flex;flex-direction:column}.docs-folder-picker-item{display:flex;align-items:center;gap:.375rem;background:transparent;border:none;text-align:left;padding:.375rem .5rem;cursor:pointer;color:var(--text-basic-color);border-radius:.25rem}.docs-folder-picker-item:hover:not(:disabled){background:var(--background-basic-color-2)}.docs-folder-picker-item.selected{background:var(--color-primary-transparent-200)}.docs-folder-picker-item:disabled{opacity:.4;cursor:not-allowed}\n"], dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i4.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i5.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i5.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsFolderPickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-folder-picker', template: `
		<input
			nbInput
			fullWidth
			size="small"
			type="text"
			[placeholder]="'DOCS.DIALOGS.MOVE_SEARCH' | translate"
			[attr.aria-label]="'DOCS.DIALOGS.MOVE_SEARCH' | translate"
			[(ngModel)]="search"
		/>
		<div class="docs-folder-picker-list">
			<button
				*ngFor="let destination of filtered"
				type="button"
				class="docs-folder-picker-item"
				[class.selected]="isSelected(destination)"
				[disabled]="destination.disabled"
				[style.padding-left.rem]="0.5 + destination.depth * 1"
				(click)="select(destination)"
			>
				<nb-icon [icon]="destination.id ? 'folder-outline' : 'home-outline'" size="tiny"></nb-icon>
				{{ destination.name }}
			</button>
		</div>
	`, standalone: false, styles: [".docs-folder-picker-list{max-height:40vh;overflow-y:auto;margin:.75rem 0;display:flex;flex-direction:column}.docs-folder-picker-item{display:flex;align-items:center;gap:.375rem;background:transparent;border:none;text-align:left;padding:.375rem .5rem;cursor:pointer;color:var(--text-basic-color);border-radius:.25rem}.docs-folder-picker-item:hover:not(:disabled){background:var(--background-basic-color-2)}.docs-folder-picker-item.selected{background:var(--color-primary-transparent-200)}.docs-folder-picker-item:disabled{opacity:.4;cursor:not-allowed}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.DocumentTreeStore }], propDecorators: { excludeIds: [{
                type: Input
            }], selectedId: [{
                type: Input
            }], selectedIdChange: [{
                type: Output
            }] } });
//# sourceMappingURL=docs-folder-picker.component.js.map