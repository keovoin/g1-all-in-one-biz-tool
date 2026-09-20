import { AfterViewInit, OnInit } from '@angular/core';
import { Cell, DefaultEditor } from 'angular2-smart-table';
import { IEmployee, IOrganization } from '@gauzy/contracts';
import { ToggleSwitcherComponent } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
export declare class JobSearchStatusEditorComponent extends DefaultEditor implements AfterViewInit, OnInit {
    organization: IOrganization;
    employee: IEmployee;
    readonly cell: Cell;
    readonly switcher: ToggleSwitcherComponent;
    private readonly _cdr;
    private readonly _store;
    private readonly _jobSearchStoreService;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Updates the job search availability status of an employee within the organization.
     *
     * `@param` isJobSearchActive - A boolean flag indicating whether the job search is active.
     */
    updateJobSearchAvailability(isJobSearchActive: boolean): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobSearchStatusEditorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<JobSearchStatusEditorComponent, "ng-component", never, { "cell": { "alias": "cell"; "required": false; }; }, {}, never, never, true, never>;
}
