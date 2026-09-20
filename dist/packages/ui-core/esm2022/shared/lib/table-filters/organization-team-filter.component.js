import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { combineLatest, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { OrganizationTeamsService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@ng-select/ng-select";
import * as i3 from "@ngx-translate/core";
let OrganizationTeamFilterComponent = class OrganizationTeamFilterComponent extends DefaultFilter {
    constructor(store, organizationTeamsService) {
        super();
        this.store = store;
        this.organizationTeamsService = organizationTeamsService;
        this.teams = [];
        this.subject$ = new Subject();
    }
    ngOnInit() {
        this.subject$
            .pipe(
        // Tap operator: Perform actions when a notification is received
        tap(() => this.getTeams()), 
        // untilDestroyed: Automatically unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
        // Subscribe to changes in the selected organization and employee
        const storeOrganization$ = this.store.selectedOrganization$;
        const storeEmployee$ = this.store.selectedEmployee$;
        combineLatest([storeOrganization$, storeEmployee$])
            .pipe(
        // Ensure distinct combinations are processed
        distinctUntilChange(), 
        // Filter out combinations where the organization is falsy
        filter(([organization]) => !!organization), 
        // Perform actions when new values are emitted
        tap(([organization, employee]) => {
            // Update component properties based on the emitted values
            this.organization = organization;
            this.selectedEmployeeId = employee ? employee.id : null;
        }), 
        // Emit a notification to trigger further actions
        tap(() => this.subject$.next(true)), 
        // Automatically unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
    }
    ngOnChanges(changes) { }
    /**
     *
     * @param value
     */
    onChange(value) {
        this.column.filterFunction(value, this.column.id);
    }
    /**
     *
     * @returns
     */
    async getTeams() {
        if (!this.organization) {
            return;
        }
        try {
            const { id: organizationId, tenantId } = this.organization;
            // Fetch teams from the service
            const { items = [] } = await this.organizationTeamsService.getMyTeams({
                organizationId,
                tenantId,
                // Additional parameters based on selectedEmployeeId
                ...(this.selectedEmployeeId
                    ? {
                        members: {
                            employeeId: this.selectedEmployeeId
                        }
                    }
                    : {})
            });
            // Update the teams property with the fetched items
            this.teams = items;
        }
        catch (error) {
            // Handle errors, log or display error messages
            console.error('Error while fetching teams:', error);
            // You might want to notify the user or perform other error handling actions
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamFilterComponent, deps: [{ token: i1.Store }, { token: i1.OrganizationTeamsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: OrganizationTeamFilterComponent, isStandalone: false, selector: "ga-organization-team-select-filter", usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
		<ng-select
		  appendTo="body"
		  [clearable]="true"
		  [closeOnSelect]="true"
		  [placeholder]="'TASKS_PAGE.SELECT' | translate"
		  (change)="onChange($event)"
		  >
		  @for (team of teams; track team) {
		    <ng-option [value]="team">
		      {{ team.name }}
		    </ng-option>
		  }
		</ng-select>
		`, isInline: true, dependencies: [{ kind: "component", type: i2.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "component", type: i2.NgOptionComponent, selector: "ng-option", inputs: ["value", "disabled"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
OrganizationTeamFilterComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store, OrganizationTeamsService])
], OrganizationTeamFilterComponent);
export { OrganizationTeamFilterComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamFilterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-organization-team-select-filter',
                    template: `
		<ng-select
		  appendTo="body"
		  [clearable]="true"
		  [closeOnSelect]="true"
		  [placeholder]="'TASKS_PAGE.SELECT' | translate"
		  (change)="onChange($event)"
		  >
		  @for (team of teams; track team) {
		    <ng-option [value]="team">
		      {{ team.name }}
		    </ng-option>
		  }
		</ng-select>
		`,
                    standalone: false
                }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.OrganizationTeamsService }] });
//# sourceMappingURL=organization-team-filter.component.js.map