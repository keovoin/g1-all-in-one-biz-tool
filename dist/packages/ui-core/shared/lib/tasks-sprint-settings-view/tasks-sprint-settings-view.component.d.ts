import { OnDestroy, OnInit } from '@angular/core';
import { IOrganization, IOrganizationProject, IOrganizationSprint } from '@gauzy/contracts';
import { SprintStoreService, Store } from '@gauzy/ui-core/core';
import { Observable } from 'rxjs';
import { ItemActionType } from '../editable-grid/gauzy-editable-grid.component';
import * as i0 from "@angular/core";
export declare class TasksSprintSettingsViewComponent implements OnInit, OnDestroy {
    private store;
    private storeService;
    project: IOrganizationProject;
    sprints$: Observable<IOrganizationSprint[]>;
    organization: IOrganization;
    constructor(store: SprintStoreService, storeService: Store);
    ngOnInit(): void;
    sprintAction({ actionType, data }: {
        actionType: ItemActionType;
        data: IOrganizationSprint;
    }): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TasksSprintSettingsViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TasksSprintSettingsViewComponent, "ngx-tasks-sprint-settings-view", never, { "project": { "alias": "project"; "required": false; }; }, {}, never, never, false, never>;
}
