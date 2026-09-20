import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { first, firstValueFrom, tap } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LocalDataSource } from 'angular2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { OrganizationProjectModuleService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { StatusViewComponent, ToggleSwitcherComponent, DateViewComponent, EmployeesMergedTeamsComponent, EmployeeWithLinksComponent } from '../../table-components';
import { DeleteConfirmationComponent } from '../../user/forms/delete-confirmation/delete-confirmation.component';
import { ProjectModuleMutationComponent } from '../project-module-mutation/project-module-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "angular2-smart-table";
import * as i5 from "../../gauzy-button-action/gauzy-button-action.component";
import * as i6 from "../../smart-data-layout/smart-table-loading/smart-table-settling.directive";
import * as i7 from "../../smart-data-layout/smart-table-filters/smart-table-filter-toggle.directive";
let ProjectModuleTableComponent = class ProjectModuleTableComponent extends TranslationBaseComponent {
    get projectId() {
        return this._projectId;
    }
    set projectId(value) {
        if (value !== this._projectId) {
            this._projectId = value;
            this.loadModules();
        }
    }
    constructor(translateService, dialogService, toastrService, organizationProjectModuleService) {
        super(translateService);
        this.translateService = translateService;
        this.dialogService = dialogService;
        this.toastrService = toastrService;
        this.organizationProjectModuleService = organizationProjectModuleService;
        this.modules = [];
        this.smartTableSource = new LocalDataSource();
        this.loading = true;
        this.disableButton = true;
    }
    ngOnInit() {
        this._applyTranslationOnSmartTable();
        this._subscribeToModuleUpdates();
        this._loadSmartTableSettings();
    }
    /**
     * Loads project modules for the given projectId.
     */
    async loadModules() {
        if (!this.projectId) {
            return;
        }
        this.loading = true;
        try {
            const { items } = await firstValueFrom(this.organizationProjectModuleService.getAllModulesByProjectId({ projectId: this.projectId }, [
                'teams',
                'teams.members',
                'teams.members.employee',
                'teams.members.employee.user',
                'members',
                'members.employee',
                'members.employee.user',
                'tasks',
                'parent'
            ]));
            this.modules = (items || []).map((module) => {
                return {
                    ...module,
                    parentName: module.parent ? module.parent.name : '-',
                    managers: this.getProjectModuleManagers(module),
                    employeesMergedTeams: this.getNonManagerEmployees(module)
                };
            });
            this.smartTableSource.load(this.modules);
        }
        catch (error) {
            this.toastrService.danger('TOASTR.MESSAGE.SOMETHING_BAD_HAPPENED');
        }
        finally {
            this.loading = false;
        }
    }
    /**
     * Configures the settings for the Smart Table.
     */
    _loadSmartTableSettings() {
        this.settingsSmartTable = {
            actions: false,
            columns: {
                name: {
                    title: this.getTranslation('ORGANIZATIONS_PAGE.NAME'),
                    type: 'string'
                },
                isFavorite: {
                    title: 'isFavorite',
                    type: 'custom',
                    width: '5%',
                    isFilterable: false,
                    renderComponent: ToggleSwitcherComponent,
                    componentInitFunction: (instance, cell) => {
                        const module = cell.getRow().getData();
                        instance.label = false;
                        instance.value = module.isFavorite;
                        // Update the module's isFavorite status
                        instance.onSwitched.subscribe((toggle) => {
                            this.updateModule(module.id, { ...module, isFavorite: toggle });
                        });
                    }
                },
                parentName: {
                    title: this.getTranslation('PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.PARENT_MODULE'),
                    type: 'string',
                    class: 'text-wrap',
                    isFilterable: false
                },
                status: {
                    title: this.getTranslation('TASKS_PAGE.TASKS_STATUS'),
                    type: 'custom',
                    width: '10%',
                    isFilterable: false,
                    renderComponent: StatusViewComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.value = cell.getValue();
                    }
                },
                startDate: {
                    title: this.getTranslation('ORGANIZATIONS_PAGE.EDIT.START_DATE'),
                    type: 'custom',
                    isFilterable: false,
                    renderComponent: DateViewComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.value = cell.getValue();
                    }
                },
                endDate: {
                    title: this.getTranslation('ORGANIZATIONS_PAGE.EDIT.END_DATE'),
                    type: 'custom',
                    isFilterable: false,
                    renderComponent: DateViewComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.value = cell.getValue();
                    }
                },
                managers: {
                    title: this.getTranslation('ORGANIZATIONS_PAGE.EDIT.TEAMS_PAGE.MANAGERS'),
                    type: 'custom',
                    isFilterable: false,
                    renderComponent: EmployeeWithLinksComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                        instance.value = cell.getRawValue();
                    }
                },
                employeesMergedTeams: {
                    title: this.getTranslation('ORGANIZATIONS_PAGE.EDIT.MEMBERS'),
                    type: 'custom',
                    renderComponent: EmployeesMergedTeamsComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                        instance.value = cell.getRawValue();
                    }
                }
            }
        };
    }
    /**
     * Handles row selection in the Smart Table.
     * @param event Table row selection event.
     */
    selectItem({ isSelected, data }) {
        this.selectedItem = isSelected ? data : null;
        this.disableButton = !isSelected;
    }
    /**
     * Deletes the selected module and reloads the table.
     */
    async delete() {
        const result = await firstValueFrom(this.dialogService.open(DeleteConfirmationComponent).onClose.pipe(first()));
        if (!result)
            return;
        try {
            await firstValueFrom(this.organizationProjectModuleService.delete(this.selectedItem.id));
            this.toastrService.success('TOASTR.MESSAGE.MODULE_DELETED');
            await this.loadModules();
        }
        catch {
            this.toastrService.danger('TOASTR.MESSAGE.SOMETHING_BAD_HAPPENED');
        }
    }
    /**
     * Opens the edit dialog for the selected project module.
     */
    async onEditProjectModuleDialog() {
        this.dialogService.open(ProjectModuleMutationComponent, {
            context: {
                projectModule: this.selectedItem,
                createModule: false
            }
        });
    }
    /**
     * Updates a module's properties and reloads the table if successful.
     *
     * @param id Module ID.
     * @param changes Object containing the updated fields.
     */
    async updateModule(id, changes) {
        try {
            await firstValueFrom(this.organizationProjectModuleService.update(id, changes));
            this.toastrService.success('TOASTR.MESSAGE.MODULE_UPDATED');
            await this.loadModules();
        }
        catch {
            this.toastrService.danger('TOASTR.MESSAGE.SOMETHING_BAD_HAPPENED');
        }
    }
    /**
     * Listens for language changes and triggers the loading of Smart Table settings.
     * Unsubscribes when the component is destroyed.
     */
    _applyTranslationOnSmartTable() {
        this.translateService.onLangChange
            .pipe(tap(() => this._loadSmartTableSettings()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Retrieves the project managers from the list of members.
     *
     * @param projectModule - The project module containing members.
     * @returns A list of manager employees.
     */
    getProjectModuleManagers(projectModule) {
        return projectModule.members
            .filter((member) => member.isManager)
            .map((member) => member.employee);
    }
    /**
     * Retrieves the non-manager employees from the list of members.
     *
     * @param projectModule - The project module containing members.
     * @returns A list of non-manager employees as merged teams.
     */
    getNonManagerEmployees(projectModule) {
        return [
            projectModule.members
                .filter((member) => !member.isManager)
                .map((member) => member.employee)
        ];
    }
    /**
     * Subscribes to module updates and automatically reloads the table when changes occur.
     */
    _subscribeToModuleUpdates() {
        this.organizationProjectModuleService.moduleUpdated$
            .pipe(untilDestroyed(this))
            .subscribe(() => this.loadModules());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectModuleTableComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogService }, { token: i3.ToastrService }, { token: i3.OrganizationProjectModuleService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ProjectModuleTableComponent, isStandalone: false, selector: "ngx-project-module-table", inputs: { projectId: "projectId" }, usesInheritance: true, ngImport: i0, template: "<div class=\"main-wrapper\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n\t<div class=\"gauzy-button-container\">\n\t\t<ngx-gauzy-button-action\n\t\t\t[hasLayoutSelector]=\"false\"\n\t\t\t[buttonTemplate]=\"actionButtons\"\n\t\t\t[isDisable]=\"disableButton\"\n\t\t></ngx-gauzy-button-action>\n\t</div>\n\t<div class=\"table-scroll-container\">\n\t\t<angular2-smart-table\n\t\t\t[class.ga-table-loading]=\"loading\"\n\t\t\t[settings]=\"settingsSmartTable\"\n\t\t\t(userRowSelect)=\"selectItem($event)\"\n\t\t\t[source]=\"smartTableSource\"\n\t\t\tstyle=\"cursor: pointer\"\n\t\t\t#variantTable\n\t\t></angular2-smart-table>\n\t</div>\n</div>\n\n<!-- Actions -->\n<ng-template #actionButtons>\n\t<div class=\"actions\">\n\t\t<button\n\t\t\t(click)=\"onEditProjectModuleDialog()\"\n\t\t\tnbButton\n\t\t\tstatus=\"basic\"\n\t\t\tclass=\"action primary\"\n\t\t\tsize=\"small\"\n\t\t\t[disabled]=\"disableButton\"\n\t\t>\n\t\t\t<nb-icon icon=\"edit-outline\"></nb-icon>\n\t\t\t{{ 'BUTTONS.EDIT' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\t(click)=\"delete()\"\n\t\t\tnbButton\n\t\t\tstatus=\"basic\"\n\t\t\tclass=\"action\"\n\t\t\t[disabled]=\"disableButton\"\n\t\t\tsize=\"small\"\n\t\t\t[nbTooltip]=\"'BUTTONS.DELETE' | translate\"\n\t\t>\n\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\"> </nb-icon>\n\t\t</button>\n\t</div>\n</ng-template>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host ngx-gauzy-button-action ::ng-deep .transition-container span{background-color:unset}:host ngx-gauzy-button-action ::ng-deep .actions-container{padding-top:0}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host .table-scroll-container{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem)}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}:host ::ng-deep ga-notes-with-tags .tags:has(nb-badge){margin-bottom:.5rem}:host ::ng-deep ga-status-badge .badge-success{color:var(--gauzy-action-success-text, #047857);background-color:var(--gauzy-action-success-tint, rgba(4, 120, 87, .08))}:host ::ng-deep ga-status-badge .badge-warning{color:var(--gauzy-action-warning-text, #b45309);background-color:var(--gauzy-action-warning-tint, rgba(180, 83, 9, .08))}:host ::ng-deep ga-status-badge .badge-danger{color:var(--gauzy-action-danger-text, #dc2626);background-color:var(--gauzy-action-danger-tint, rgba(220, 38, 38, .08))}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination,:host .pagination-container ::ng-deep ga-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav,:host .pagination-container ::ng-deep ga-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination,:host .pagination-container ::ng-deep ga-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span,:host .pagination-container ::ng-deep ga-pagination li a,:host .pagination-container ::ng-deep ga-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span,:host .pagination-container ::ng-deep ga-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon,:host .pagination-container ::ng-deep ga-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon,:host .pagination-container ::ng-deep ga-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon,:host .pagination-container ::ng-deep ga-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled,:host .pagination-container ::ng-deep ga-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span,:host .pagination-container ::ng-deep ga-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div,:host .pagination-container ::ng-deep ga-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button,:host .pagination-container ::ng-deep ga-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}:host .gauzy-button-container{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i4.Angular2SmartTableComponent, selector: "angular2-smart-table", inputs: ["source", "settings"], outputs: ["rowSelect", "userRowSelect", "delete", "edit", "create", "custom", "deleteConfirm", "editConfirm", "editCancel", "createConfirm", "createCancel", "rowHover", "afterGridInit"] }, { kind: "component", type: i5.GauzyButtonActionComponent, selector: "ngx-gauzy-button-action", inputs: ["isDisable", "hasLayoutSelector", "componentName", "buttonTemplate", "buttonTemplateVisible"] }, { kind: "directive", type: i6.SmartTableSettlingDirective, selector: "angular2-smart-table" }, { kind: "directive", type: i7.SmartTableFilterToggleDirective, selector: "angular2-smart-table" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
ProjectModuleTableComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        NbDialogService,
        ToastrService,
        OrganizationProjectModuleService])
], ProjectModuleTableComponent);
export { ProjectModuleTableComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectModuleTableComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-project-module-table', standalone: false, template: "<div class=\"main-wrapper\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n\t<div class=\"gauzy-button-container\">\n\t\t<ngx-gauzy-button-action\n\t\t\t[hasLayoutSelector]=\"false\"\n\t\t\t[buttonTemplate]=\"actionButtons\"\n\t\t\t[isDisable]=\"disableButton\"\n\t\t></ngx-gauzy-button-action>\n\t</div>\n\t<div class=\"table-scroll-container\">\n\t\t<angular2-smart-table\n\t\t\t[class.ga-table-loading]=\"loading\"\n\t\t\t[settings]=\"settingsSmartTable\"\n\t\t\t(userRowSelect)=\"selectItem($event)\"\n\t\t\t[source]=\"smartTableSource\"\n\t\t\tstyle=\"cursor: pointer\"\n\t\t\t#variantTable\n\t\t></angular2-smart-table>\n\t</div>\n</div>\n\n<!-- Actions -->\n<ng-template #actionButtons>\n\t<div class=\"actions\">\n\t\t<button\n\t\t\t(click)=\"onEditProjectModuleDialog()\"\n\t\t\tnbButton\n\t\t\tstatus=\"basic\"\n\t\t\tclass=\"action primary\"\n\t\t\tsize=\"small\"\n\t\t\t[disabled]=\"disableButton\"\n\t\t>\n\t\t\t<nb-icon icon=\"edit-outline\"></nb-icon>\n\t\t\t{{ 'BUTTONS.EDIT' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\t(click)=\"delete()\"\n\t\t\tnbButton\n\t\t\tstatus=\"basic\"\n\t\t\tclass=\"action\"\n\t\t\t[disabled]=\"disableButton\"\n\t\t\tsize=\"small\"\n\t\t\t[nbTooltip]=\"'BUTTONS.DELETE' | translate\"\n\t\t>\n\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\"> </nb-icon>\n\t\t</button>\n\t</div>\n</ng-template>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host ngx-gauzy-button-action ::ng-deep .transition-container span{background-color:unset}:host ngx-gauzy-button-action ::ng-deep .actions-container{padding-top:0}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host .table-scroll-container{background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem)}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}:host ::ng-deep ga-notes-with-tags .tags:has(nb-badge){margin-bottom:.5rem}:host ::ng-deep ga-status-badge .badge-success{color:var(--gauzy-action-success-text, #047857);background-color:var(--gauzy-action-success-tint, rgba(4, 120, 87, .08))}:host ::ng-deep ga-status-badge .badge-warning{color:var(--gauzy-action-warning-text, #b45309);background-color:var(--gauzy-action-warning-tint, rgba(180, 83, 9, .08))}:host ::ng-deep ga-status-badge .badge-danger{color:var(--gauzy-action-danger-text, #dc2626);background-color:var(--gauzy-action-danger-tint, rgba(220, 38, 38, .08))}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination,:host .pagination-container ::ng-deep ga-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav,:host .pagination-container ::ng-deep ga-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination,:host .pagination-container ::ng-deep ga-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span,:host .pagination-container ::ng-deep ga-pagination li a,:host .pagination-container ::ng-deep ga-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span,:host .pagination-container ::ng-deep ga-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon,:host .pagination-container ::ng-deep ga-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon,:host .pagination-container ::ng-deep ga-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon,:host .pagination-container ::ng-deep ga-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled,:host .pagination-container ::ng-deep ga-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span,:host .pagination-container ::ng-deep ga-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div,:host .pagination-container ::ng-deep ga-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button,:host .pagination-container ::ng-deep ga-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}:host .gauzy-button-container{--button-small-icon-size: .875rem;--button-small-icon-offset: .25rem;--button-small-icon-vertical-margin: 0;--button-filled-small-padding: .25rem .625rem;--button-outline-small-padding: .25rem .625rem;--button-ghost-small-padding: .25rem .625rem;--icon-button-filled-small-padding: .25rem;--icon-button-outline-small-padding: .25rem;--icon-button-ghost-small-padding: .25rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogService }, { type: i3.ToastrService }, { type: i3.OrganizationProjectModuleService }], propDecorators: { projectId: [{
                type: Input
            }] } });
//# sourceMappingURL=project-module-table.component.js.map