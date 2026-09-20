import { OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'angular2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { ID, IEmployee, IOrganizationProjectModule } from '@gauzy/contracts';
import { OrganizationProjectModuleService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class ProjectModuleTableComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly dialogService;
    private readonly toastrService;
    private readonly organizationProjectModuleService;
    modules: IOrganizationProjectModule[];
    selectedItem: IOrganizationProjectModule;
    settingsSmartTable: object;
    smartTableSource: LocalDataSource;
    loading: boolean;
    disableButton: boolean;
    /**
     * Project ID to fetch modules for.
     * Uses getter and setter to detect changes and reload data if needed.
     */
    private _projectId;
    get projectId(): ID;
    set projectId(value: ID);
    constructor(translateService: TranslateService, dialogService: NbDialogService, toastrService: ToastrService, organizationProjectModuleService: OrganizationProjectModuleService);
    ngOnInit(): void;
    /**
     * Loads project modules for the given projectId.
     */
    loadModules(): Promise<void>;
    /**
     * Configures the settings for the Smart Table.
     */
    _loadSmartTableSettings(): void;
    /**
     * Handles row selection in the Smart Table.
     * @param event Table row selection event.
     */
    selectItem({ isSelected, data }: {
        isSelected: any;
        data: any;
    }): void;
    /**
     * Deletes the selected module and reloads the table.
     */
    delete(): Promise<void>;
    /**
     * Opens the edit dialog for the selected project module.
     */
    onEditProjectModuleDialog(): Promise<void>;
    /**
     * Updates a module's properties and reloads the table if successful.
     *
     * @param id Module ID.
     * @param changes Object containing the updated fields.
     */
    private updateModule;
    /**
     * Listens for language changes and triggers the loading of Smart Table settings.
     * Unsubscribes when the component is destroyed.
     */
    private _applyTranslationOnSmartTable;
    /**
     * Retrieves the project managers from the list of members.
     *
     * @param projectModule - The project module containing members.
     * @returns A list of manager employees.
     */
    getProjectModuleManagers(projectModule: IOrganizationProjectModule): IEmployee[];
    /**
     * Retrieves the non-manager employees from the list of members.
     *
     * @param projectModule - The project module containing members.
     * @returns A list of non-manager employees as merged teams.
     */
    getNonManagerEmployees(projectModule: IOrganizationProjectModule): IEmployee[][];
    /**
     * Subscribes to module updates and automatically reloads the table when changes occur.
     */
    private _subscribeToModuleUpdates;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProjectModuleTableComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProjectModuleTableComponent, "ngx-project-module-table", never, { "projectId": { "alias": "projectId"; "required": false; }; }, {}, never, never, false, never>;
}
