import { __decorate } from "tslib";
import { ChangeDetectorRef, Component, inject, Input, ViewChild } from '@angular/core';
import { filter, tap } from 'rxjs';
import { Cell, DefaultEditor } from 'angular2-smart-table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import { TableComponentsModule, ToggleSwitcherComponent } from '@gauzy/ui-core/shared';
import { JobSearchStoreService } from '../../providers/job-search-store.service';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/shared";
let JobSearchStatusEditorComponent = class JobSearchStatusEditorComponent extends DefaultEditor {
    constructor() {
        super(...arguments);
        this._cdr = inject(ChangeDetectorRef);
        this._store = inject(Store);
        this._jobSearchStoreService = inject(JobSearchStoreService);
    }
    ngOnInit() {
        this._store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => {
            this.organization = organization;
            this.employee = this.cell.getRow()?.getData();
        }), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        if (!this.switcher || !this.employee) {
            return;
        }
        this.switcher.value = this.employee.isJobSearchActive ?? false;
        this._cdr.detectChanges();
    }
    /**
     * Updates the job search availability status of an employee within the organization.
     *
     * `@param` isJobSearchActive - A boolean flag indicating whether the job search is active.
     */
    async updateJobSearchAvailability(isJobSearchActive) {
        if (!this.organization || !this.employee) {
            return;
        }
        try {
            await this._jobSearchStoreService.updateJobSearchAvailability(this.organization, this.employee, isJobSearchActive);
        }
        catch (error) {
            console.error('Error while updating job search availability:', error);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchStatusEditorComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: JobSearchStatusEditorComponent, isStandalone: true, selector: "ng-component", inputs: { cell: "cell" }, viewQueries: [{ propertyName: "switcher", first: true, predicate: ToggleSwitcherComponent, descendants: true }], usesInheritance: true, ngImport: i0, template: `
		<ngx-toggle-switcher
			[label]="false"
			(onSwitched)="updateJobSearchAvailability($event)"
			[value]="employee?.isJobSearchActive ?? false"
		></ngx-toggle-switcher>
	`, isInline: true, dependencies: [{ kind: "ngmodule", type: TableComponentsModule }, { kind: "component", type: i1.ToggleSwitcherComponent, selector: "ngx-toggle-switcher", inputs: ["value", "rowData", "label"], outputs: ["onSwitched"] }] }); }
};
JobSearchStatusEditorComponent = __decorate([
    UntilDestroy()
], JobSearchStatusEditorComponent);
export { JobSearchStatusEditorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchStatusEditorComponent, decorators: [{
            type: Component,
            args: [{
                    template: `
		<ngx-toggle-switcher
			[label]="false"
			(onSwitched)="updateJobSearchAvailability($event)"
			[value]="employee?.isJobSearchActive ?? false"
		></ngx-toggle-switcher>
	`,
                    standalone: true,
                    imports: [TableComponentsModule]
                }]
        }], propDecorators: { cell: [{
                type: Input
            }], switcher: [{
                type: ViewChild,
                args: [ToggleSwitcherComponent]
            }] } });
//# sourceMappingURL=job-search-status-editor.component.js.map