import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { SprintStoreService, Store } from '@gauzy/ui-core/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../editable-grid/gauzy-editable-grid.component";
import * as i4 from "./sprint-dialog/sprint-dialog.component";
import * as i5 from "@angular/common";
import * as i6 from "@ngx-translate/core";
import * as i7 from "../pipes/date-format.pipe";
import * as i8 from "../pipes/truncate.pipe";
let TasksSprintSettingsViewComponent = class TasksSprintSettingsViewComponent {
    constructor(store, storeService) {
        this.store = store;
        this.storeService = storeService;
        this.sprints$ = this.store.sprints$.pipe(map((sprints) => sprints.filter((sprint) => sprint.projectId === this.project?.id)), map((sprints) => {
            return sprints.sort((sprint, nextSprint) => (sprint.startDate < nextSprint.startDate ? -1 : 1));
        }));
    }
    ngOnInit() {
        this.storeService.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.store.fetchSprints({
            organizationId: this.organization.id,
            tenantId: this.storeService.user.tenantId,
            projectId: this.project?.id
        })), untilDestroyed(this))
            .subscribe();
    }
    sprintAction({ actionType, data }) {
        switch (actionType) {
            case 'create':
                const createSprintInput = {
                    ...data,
                    organizationId: this.project.organizationId,
                    tenantId: this.storeService.user.tenantId,
                    projectId: this.project.id
                };
                this.store.createSprint(createSprintInput).pipe(untilDestroyed(this)).subscribe();
                break;
            case 'edit':
                this.store.updateSprint(data).pipe(untilDestroyed(this)).subscribe();
                break;
            case 'delete':
                this.store.deleteSprint(data.id).pipe(untilDestroyed(this)).subscribe();
                break;
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksSprintSettingsViewComponent, deps: [{ token: i1.SprintStoreService }, { token: i1.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TasksSprintSettingsViewComponent, isStandalone: false, selector: "ngx-tasks-sprint-settings-view", inputs: { project: "project" }, ngImport: i0, template: "<div class=\"sprints\">\n  <div class=\"sprints__settings\">\n    <nb-card class=\"card\">\n      @if (sprints$ | async; as sprints) {\n      <ng-container ngProjectAs=\"nb-card-body\">\n        <nb-card-body class=\"pt-0\">\n          <ga-editable-grid\n            [itemTmpl]=\"item\"\n            [items]=\"sprints\"\n            [addDialogTmpl]=\"addDialog\"\n            [editDialogTmpl]=\"editDialog\"\n            [deleteDialogTmpl]=\"deleteDialog\"\n            (dialogData)=\"sprintAction($event)\"\n          >\n            <ng-template #addDialog let-sprint let-action=\"action\" let-dialogRef=\"dialogRef\">\n              <ngx-sprint-dialog\n                [action]=\"action\"\n                [dialogRef]=\"dialogRef\"\n                [options]=\"{\n                  sprintIndex: sprints?.length,\n                  sprintStartDate: sprints.slice(-1)[0]?.endDate\n                }\"\n              ></ngx-sprint-dialog>\n            </ng-template>\n            <ng-template #editDialog let-sprint let-action=\"action\" let-dialogRef=\"dialogRef\">\n              <ngx-sprint-dialog [action]=\"action\" [sprintData]=\"sprint\" [dialogRef]=\"dialogRef\"></ngx-sprint-dialog>\n            </ng-template>\n            <ng-template #deleteDialog let-sprint let-dialogRef=\"dialogRef\">\n              <nb-card>\n                <nb-card-header>{{ 'TASKS_PAGE.DELETE_SPRINT' | translate }}</nb-card-header>\n                <nb-card-body> {{ 'TASKS_PAGE.ARE_YOU_SURE' | translate }}: {{ sprint.name }}? </nb-card-body>\n                <nb-card-footer>\n                  <button nbButton status=\"warning\" class=\"mr-3\" (click)=\"dialogRef.close()\" size=\"small\">\n                    {{ 'BUTTONS.NO' | translate }}\n                  </button>\n                  <button nbButton status=\"success\" (click)=\"dialogRef.close(sprint)\" size=\"small\">\n                    {{ 'BUTTONS.YES' | translate }}\n                  </button>\n                </nb-card-footer>\n              </nb-card>\n            </ng-template>\n            <ng-template #item let-sprint>\n              <div class=\"d-flex justify-content-between align-items-center px-2 sprints__item w-100\">\n                <span class=\"col-2\">{{ sprint.name }}</span>\n                <span class=\"col\">{{ sprint.goal | truncate : 50 }}</span>\n                <span class=\"col-4 d-flex flex-column\">\n                  @if (sprint.startDate) {\n                    <div class=\"row\">\n                      <span class=\"col-6\"> {{ 'TASKS_PAGE.DATE_START' | translate }}: </span>\n                      <span class=\"col-6\">\n                        {{ sprint.startDate | dateFormat : '' : 'DD-MM-YYYY' }}\n                      </span>\n                    </div>\n                  } @if (sprint.endDate) {\n                    <div class=\"row\">\n                      <span class=\"col-6\"> {{ 'TASKS_PAGE.DATE_END' | translate }}: </span>\n                      <span class=\"col-6\">\n                        {{ sprint.endDate | dateFormat : '' : 'DD-MM-YYYY' }}\n                      </span>\n                    </div>\n                  }\n                </span>\n              </div>\n            </ng-template>\n          </ga-editable-grid>\n        </nb-card-body>\n      </ng-container>\n      }\n    </nb-card>\n  </div>\n</div>\n", styles: [":host ga-editable-grid ::ng-deep nb-card{margin:0}:host .sprints{padding:0rem 1rem}:host nb-card.card{background-color:unset;border:none;border-radius:var(--border-radius);padding-top:0}\n"], dependencies: [{ kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i3.GauzyEditableGridComponent, selector: "ga-editable-grid", inputs: ["items", "itemTmpl", "addDialogTmpl", "editDialogTmpl", "deleteDialogTmpl"], outputs: ["dialogData"] }, { kind: "component", type: i4.SprintDialogComponent, selector: "ngx-sprint-dialog", inputs: ["action", "sprintData", "dialogRef", "options"] }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }, { kind: "pipe", type: i7.DateFormatPipe, name: "dateFormat" }, { kind: "pipe", type: i8.TruncatePipe, name: "truncate" }] }); }
};
TasksSprintSettingsViewComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [SprintStoreService, Store])
], TasksSprintSettingsViewComponent);
export { TasksSprintSettingsViewComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksSprintSettingsViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-tasks-sprint-settings-view', standalone: false, template: "<div class=\"sprints\">\n  <div class=\"sprints__settings\">\n    <nb-card class=\"card\">\n      @if (sprints$ | async; as sprints) {\n      <ng-container ngProjectAs=\"nb-card-body\">\n        <nb-card-body class=\"pt-0\">\n          <ga-editable-grid\n            [itemTmpl]=\"item\"\n            [items]=\"sprints\"\n            [addDialogTmpl]=\"addDialog\"\n            [editDialogTmpl]=\"editDialog\"\n            [deleteDialogTmpl]=\"deleteDialog\"\n            (dialogData)=\"sprintAction($event)\"\n          >\n            <ng-template #addDialog let-sprint let-action=\"action\" let-dialogRef=\"dialogRef\">\n              <ngx-sprint-dialog\n                [action]=\"action\"\n                [dialogRef]=\"dialogRef\"\n                [options]=\"{\n                  sprintIndex: sprints?.length,\n                  sprintStartDate: sprints.slice(-1)[0]?.endDate\n                }\"\n              ></ngx-sprint-dialog>\n            </ng-template>\n            <ng-template #editDialog let-sprint let-action=\"action\" let-dialogRef=\"dialogRef\">\n              <ngx-sprint-dialog [action]=\"action\" [sprintData]=\"sprint\" [dialogRef]=\"dialogRef\"></ngx-sprint-dialog>\n            </ng-template>\n            <ng-template #deleteDialog let-sprint let-dialogRef=\"dialogRef\">\n              <nb-card>\n                <nb-card-header>{{ 'TASKS_PAGE.DELETE_SPRINT' | translate }}</nb-card-header>\n                <nb-card-body> {{ 'TASKS_PAGE.ARE_YOU_SURE' | translate }}: {{ sprint.name }}? </nb-card-body>\n                <nb-card-footer>\n                  <button nbButton status=\"warning\" class=\"mr-3\" (click)=\"dialogRef.close()\" size=\"small\">\n                    {{ 'BUTTONS.NO' | translate }}\n                  </button>\n                  <button nbButton status=\"success\" (click)=\"dialogRef.close(sprint)\" size=\"small\">\n                    {{ 'BUTTONS.YES' | translate }}\n                  </button>\n                </nb-card-footer>\n              </nb-card>\n            </ng-template>\n            <ng-template #item let-sprint>\n              <div class=\"d-flex justify-content-between align-items-center px-2 sprints__item w-100\">\n                <span class=\"col-2\">{{ sprint.name }}</span>\n                <span class=\"col\">{{ sprint.goal | truncate : 50 }}</span>\n                <span class=\"col-4 d-flex flex-column\">\n                  @if (sprint.startDate) {\n                    <div class=\"row\">\n                      <span class=\"col-6\"> {{ 'TASKS_PAGE.DATE_START' | translate }}: </span>\n                      <span class=\"col-6\">\n                        {{ sprint.startDate | dateFormat : '' : 'DD-MM-YYYY' }}\n                      </span>\n                    </div>\n                  } @if (sprint.endDate) {\n                    <div class=\"row\">\n                      <span class=\"col-6\"> {{ 'TASKS_PAGE.DATE_END' | translate }}: </span>\n                      <span class=\"col-6\">\n                        {{ sprint.endDate | dateFormat : '' : 'DD-MM-YYYY' }}\n                      </span>\n                    </div>\n                  }\n                </span>\n              </div>\n            </ng-template>\n          </ga-editable-grid>\n        </nb-card-body>\n      </ng-container>\n      }\n    </nb-card>\n  </div>\n</div>\n", styles: [":host ga-editable-grid ::ng-deep nb-card{margin:0}:host .sprints{padding:0rem 1rem}:host nb-card.card{background-color:unset;border:none;border-radius:var(--border-radius);padding-top:0}\n"] }]
        }], ctorParameters: () => [{ type: i1.SprintStoreService }, { type: i1.Store }], propDecorators: { project: [{
                type: Input
            }] } });
//# sourceMappingURL=tasks-sprint-settings-view.component.js.map