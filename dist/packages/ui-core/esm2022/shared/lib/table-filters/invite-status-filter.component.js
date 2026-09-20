import { Component } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { InviteStatusEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
import * as i1 from "@ng-select/ng-select";
import * as i2 from "@ngx-translate/core";
export class InviteStatusFilterComponent extends DefaultFilter {
    constructor() {
        super(...arguments);
        this.inviteStatuses = Object.values(InviteStatusEnum);
    }
    /**
     * Handles the status selection change.
     * When the user clears the selection, value will be null/undefined which resets the filter.
     *
     * @param value - The selected invite status or null/undefined when cleared
     */
    onChange(value) {
        this.column.filterFunction(value ?? null, this.column.id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteStatusFilterComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: InviteStatusFilterComponent, isStandalone: false, selector: "ga-invite-status-filter", usesInheritance: true, ngImport: i0, template: `
		<ng-select
		  appendTo="body"
		  [clearable]="true"
		  [closeOnSelect]="true"
		  [placeholder]="'SM_TABLE.STATUS' | translate"
		  (change)="onChange($event)"
		  >
		  @for (status of inviteStatuses; track status) {
		    <ng-option [value]="status">
		      {{ status }}
		    </ng-option>
		  }
		</ng-select>
		`, isInline: true, dependencies: [{ kind: "component", type: i1.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "component", type: i1.NgOptionComponent, selector: "ng-option", inputs: ["value", "disabled"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteStatusFilterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-invite-status-filter',
                    template: `
		<ng-select
		  appendTo="body"
		  [clearable]="true"
		  [closeOnSelect]="true"
		  [placeholder]="'SM_TABLE.STATUS' | translate"
		  (change)="onChange($event)"
		  >
		  @for (status of inviteStatuses; track status) {
		    <ng-option [value]="status">
		      {{ status }}
		    </ng-option>
		  }
		</ng-select>
		`,
                    standalone: false
                }]
        }] });
//# sourceMappingURL=invite-status-filter.component.js.map