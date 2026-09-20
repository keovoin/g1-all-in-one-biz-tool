import { __decorate, __metadata } from "tslib";
import { Component, Input, Output } from '@angular/core';
import { PermissionsEnum, TimeLogSourceEnum } from '@gauzy/contracts';
import moment from 'moment';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, tap } from 'rxjs/operators';
import { Store, TimeTrackerService, TimesheetService } from '@gauzy/ui-core/core';
import { EditTimeLogModalComponent } from './../edit-time-log-modal';
import { ViewTimeLogModalComponent } from './../view-time-log-modal';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "ngx-permissions";
import * as i4 from "../../components/avatar/avatar.component";
import * as i5 from "../../directives/time-tracking-authorized-directive";
import * as i6 from "../../dialogs/directive/confirm.directive";
import * as i7 from "@ngx-translate/core";
import * as i8 from "../../pipes/duration-format.pipe";
import * as i9 from "../../pipes/time-format.pipe";
import * as i10 from "../../pipes/utc-to-local.pipe";
let ViewTimeLogComponent = class ViewTimeLogComponent {
    constructor(nbDialogService, timesheetService, store, timeTrackerService) {
        this.nbDialogService = nbDialogService;
        this.timesheetService = timesheetService;
        this.store = store;
        this.timeTrackerService = timeTrackerService;
        this.PermissionsEnum = PermissionsEnum;
        this.timeLogs = [];
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), untilDestroyed(this))
            .subscribe();
    }
    openAddByDateProject($event) {
        const [timeLog] = this.timeLogs;
        const minutes = moment().minutes();
        const stoppedAt = new Date(moment(timeLog.startedAt).format('YYYY-MM-DD') +
            ' ' +
            moment()
                .set('minutes', minutes - (minutes % 10))
                .format('HH:mm'));
        const startedAt = moment(stoppedAt).subtract('1', 'hour').toDate();
        this.openEdit($event, {
            startedAt,
            stoppedAt,
            projectId: timeLog.projectId,
            isRunning: timeLog.isRunning
        });
    }
    openEdit($event, timeLog) {
        if (timeLog.isRunning) {
            return;
        }
        $event.stopPropagation();
        this.nbDialogService
            .open(EditTimeLogModalComponent, { context: { timeLog: timeLog } })
            .onClose.pipe(untilDestroyed(this))
            .subscribe((data) => {
            this.callback(data);
        });
    }
    viewLog(timeLog) {
        this.nbDialogService
            .open(ViewTimeLogModalComponent, {
            context: {
                timeLog: timeLog
            },
            dialogClass: 'view-log-dialog'
        })
            .onClose.pipe(untilDestroyed(this))
            .subscribe((res) => {
            this.callback(res);
        });
    }
    onDeleteConfirm(timeLog) {
        if (timeLog.isRunning) {
            return;
        }
        const { id: organizationId } = this.organization;
        const request = {
            logIds: [timeLog.id],
            organizationId
        };
        this.timesheetService.deleteLogs(request).then((res) => {
            this.callback(res);
            this.checkTimerStatus();
        });
    }
    async checkTimerStatus() {
        if (!this.organization) {
            return;
        }
        const { employeeId, tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        if (employeeId) {
            await this.timeTrackerService.checkTimerStatus({
                organizationId,
                tenantId,
                source: TimeLogSourceEnum.WEB_TIMER
            });
        }
    }
    onClose() {
        this.close(true);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewTimeLogComponent, deps: [{ token: i1.NbDialogService }, { token: i2.TimesheetService }, { token: i2.Store }, { token: i2.TimeTrackerService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ViewTimeLogComponent, isStandalone: false, selector: "ngx-view-time-log", inputs: { timeLogs: "timeLogs", callback: "callback" }, outputs: { close: "close" }, ngImport: i0, template: "<div class=\"time-log-popover\">\n  <div class=\"time-log-header\">\n    <span class=\"time-log-title\">{{ 'TIMESHEET.VIEW_TIME_LOGS' | translate }}</span>\n    <button\n      nbButton\n      ghost\n      status=\"basic\"\n      size=\"small\"\n      type=\"button\"\n      class=\"icon-button\"\n      [attr.aria-label]=\"'BUTTONS.CLOSE' | translate\"\n      (click)=\"onClose()\"\n      >\n      <nb-icon icon=\"close-outline\"></nb-icon>\n    </button>\n  </div>\n\n  <nb-list class=\"time-log-list custom-scroll\">\n    @for (timeLog of timeLogs; track timeLog) {\n      <nb-list-item class=\"time-log-row\">\n        <!-- The time is what a time log is; who logged it reads under it. -->\n        <div class=\"time-log-details\">\n          <span class=\"time-log-range\">\n            {{ timeLog?.startedAt | utcToLocal | timeFormat : true }}\n            \u2013\n            @if (!timeLog?.isRunning) {\n              {{ timeLog?.stoppedAt | utcToLocal | timeFormat : true }}\n            } @else {\n              {{ 'TIMESHEET.TILL_NOW' | translate }}\n            }\n          </span>\n          <ngx-avatar\n            [id]=\"timeLog?.employee?.id\"\n            [employee]=\"timeLog?.employee\"\n            [name]=\"timeLog?.employee?.user?.name\"\n            [src]=\"timeLog?.employee?.user?.imageUrl\"\n            class=\"report-table\"\n          ></ngx-avatar>\n        </div>\n        <span class=\"time-log-duration\">{{ timeLog?.duration | durationFormat }}</span>\n        <div class=\"time-log-actions\">\n          <button\n            nbButton\n            ghost\n            status=\"basic\"\n            size=\"small\"\n            type=\"button\"\n            class=\"icon-button\"\n            (click)=\"viewLog(timeLog)\"\n            [nbTooltip]=\"'TIMESHEET.VIEW' | translate\"\n            [attr.aria-label]=\"'TIMESHEET.VIEW' | translate\"\n            >\n            <nb-icon icon=\"eye-outline\"></nb-icon>\n          </button>\n          <ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ALLOW_MODIFY_TIME\">\n            <ng-template ngxTimeTrackingAuthorized [permission]=\"PermissionsEnum.ALLOW_MODIFY_TIME\">\n              <button\n                nbButton\n                ghost\n                status=\"basic\"\n                size=\"small\"\n                type=\"button\"\n                class=\"icon-button\"\n                (click)=\"openEdit($event, timeLog)\"\n                [disabled]=\"timeLog.isRunning\"\n                [nbTooltip]=\"'TIMESHEET.EDIT' | translate\"\n                [attr.aria-label]=\"'TIMESHEET.EDIT' | translate\"\n                >\n                <nb-icon icon=\"edit-outline\"></nb-icon>\n              </button>\n            </ng-template>\n          </ng-template>\n          <ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ALLOW_DELETE_TIME\">\n            <ng-template ngxTimeTrackingAuthorized [permission]=\"PermissionsEnum.ALLOW_DELETE_TIME\">\n              <button\n                nbButton\n                ghost\n                status=\"basic\"\n                size=\"small\"\n                type=\"button\"\n                class=\"icon-button\"\n                ngxConfirmDialog\n                [message]=\"'TIMESHEET.DELETE_TIMELOG' | translate\"\n                (click)=\"$event.stopPropagation()\"\n                (confirm)=\"onDeleteConfirm(timeLog)\"\n                [disabled]=\"timeLog.isRunning\"\n                [nbTooltip]=\"'TIMESHEET.DELETE' | translate\"\n                [attr.aria-label]=\"'TIMESHEET.DELETE' | translate\"\n                >\n                <nb-icon status=\"danger\" icon=\"trash-2-outline\"></nb-icon>\n              </button>\n            </ng-template>\n          </ng-template>\n        </div>\n      </nb-list-item>\n    }\n  </nb-list>\n\n  <!-- Inside the permission check, so users who cannot add time get no empty footer. -->\n  <ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ALLOW_MANUAL_TIME\">\n    <ng-template ngxTimeTrackingAuthorized [permission]=\"PermissionsEnum.ALLOW_MANUAL_TIME\">\n      <div class=\"time-log-footer\">\n        <button nbButton status=\"primary\" size=\"small\" type=\"button\" (click)=\"openAddByDateProject($event)\">\n          <nb-icon icon=\"plus-outline\"></nb-icon>\n          {{ 'TIMESHEET.ADD_TIME' | translate }}\n        </button>\n      </div>\n    </ng-template>\n  </ng-template>\n</div>\n", styles: [":host{display:block}:host .time-log-popover{width:25rem;max-width:calc(100vw - 2rem);padding-bottom:.5rem}:host .time-log-header{display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.5rem .5rem .5rem 1rem;border-bottom:1px solid var(--gauzy-border-default-color)}:host .time-log-title{font-size:12px;font-weight:600;line-height:1rem;color:var(--text-primary-color)}:host .icon-button[nbButton]{width:1.75rem;height:1.75rem;min-width:0;margin:0;padding:0}:host .icon-button[nbButton] nb-icon{width:1rem;height:1rem;margin:0;font-size:1rem}:host .time-log-list{max-height:50vh;overflow-x:hidden;overflow-y:auto!important}:host nb-list-item.time-log-row{display:flex;align-items:center;gap:.75rem;padding:.625rem .5rem .625rem 1rem;border-top:none;border-bottom:1px solid var(--gauzy-border-default-color)}:host nb-list-item.time-log-row:last-child{border-bottom:none}:host .time-log-details{display:flex;flex:1 1 auto;flex-direction:column;align-items:flex-start;gap:.375rem;min-width:0}:host .time-log-range{font-size:12px;font-weight:600;line-height:1rem;white-space:nowrap;font-variant-numeric:tabular-nums;color:var(--gauzy-text-color-1)}@media(max-width:30rem){:host .time-log-range{white-space:normal}}:host .time-log-duration{flex:none;padding:.125rem .5rem;border-radius:var(--border-radius);background:var(--gauzy-sidebar-background-3);font-size:12px;font-weight:600;line-height:1rem;font-variant-numeric:tabular-nums;color:var(--gauzy-text-color-1)}:host .time-log-actions{display:flex;flex:none;align-items:center;gap:.25rem}:host .time-log-footer{display:flex;justify-content:flex-end;padding:.75rem 1rem;border-top:1px solid var(--gauzy-border-default-color)}:host .time-log-footer button{margin:0}\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i1.NbListComponent, selector: "nb-list", inputs: ["role"] }, { kind: "component", type: i1.NbListItemComponent, selector: "nb-list-item", inputs: ["role"] }, { kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i3.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i4.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "directive", type: i5.TimeTrackingAuthorizedDirective, selector: "[ngxTimeTrackingAuthorized]", inputs: ["permission", "permissionElse"] }, { kind: "directive", type: i6.ConfirmDirective, selector: "[ngxConfirmDialog]", inputs: ["message", "title", "yesText", "noText"], outputs: ["confirm", "decline"] }, { kind: "pipe", type: i7.TranslatePipe, name: "translate" }, { kind: "pipe", type: i8.DurationFormatPipe, name: "durationFormat" }, { kind: "pipe", type: i9.TimeFormatPipe, name: "timeFormat" }, { kind: "pipe", type: i10.UtcToLocalPipe, name: "utcToLocal" }] }); }
};
ViewTimeLogComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogService,
        TimesheetService,
        Store,
        TimeTrackerService])
], ViewTimeLogComponent);
export { ViewTimeLogComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewTimeLogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-view-time-log', standalone: false, template: "<div class=\"time-log-popover\">\n  <div class=\"time-log-header\">\n    <span class=\"time-log-title\">{{ 'TIMESHEET.VIEW_TIME_LOGS' | translate }}</span>\n    <button\n      nbButton\n      ghost\n      status=\"basic\"\n      size=\"small\"\n      type=\"button\"\n      class=\"icon-button\"\n      [attr.aria-label]=\"'BUTTONS.CLOSE' | translate\"\n      (click)=\"onClose()\"\n      >\n      <nb-icon icon=\"close-outline\"></nb-icon>\n    </button>\n  </div>\n\n  <nb-list class=\"time-log-list custom-scroll\">\n    @for (timeLog of timeLogs; track timeLog) {\n      <nb-list-item class=\"time-log-row\">\n        <!-- The time is what a time log is; who logged it reads under it. -->\n        <div class=\"time-log-details\">\n          <span class=\"time-log-range\">\n            {{ timeLog?.startedAt | utcToLocal | timeFormat : true }}\n            \u2013\n            @if (!timeLog?.isRunning) {\n              {{ timeLog?.stoppedAt | utcToLocal | timeFormat : true }}\n            } @else {\n              {{ 'TIMESHEET.TILL_NOW' | translate }}\n            }\n          </span>\n          <ngx-avatar\n            [id]=\"timeLog?.employee?.id\"\n            [employee]=\"timeLog?.employee\"\n            [name]=\"timeLog?.employee?.user?.name\"\n            [src]=\"timeLog?.employee?.user?.imageUrl\"\n            class=\"report-table\"\n          ></ngx-avatar>\n        </div>\n        <span class=\"time-log-duration\">{{ timeLog?.duration | durationFormat }}</span>\n        <div class=\"time-log-actions\">\n          <button\n            nbButton\n            ghost\n            status=\"basic\"\n            size=\"small\"\n            type=\"button\"\n            class=\"icon-button\"\n            (click)=\"viewLog(timeLog)\"\n            [nbTooltip]=\"'TIMESHEET.VIEW' | translate\"\n            [attr.aria-label]=\"'TIMESHEET.VIEW' | translate\"\n            >\n            <nb-icon icon=\"eye-outline\"></nb-icon>\n          </button>\n          <ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ALLOW_MODIFY_TIME\">\n            <ng-template ngxTimeTrackingAuthorized [permission]=\"PermissionsEnum.ALLOW_MODIFY_TIME\">\n              <button\n                nbButton\n                ghost\n                status=\"basic\"\n                size=\"small\"\n                type=\"button\"\n                class=\"icon-button\"\n                (click)=\"openEdit($event, timeLog)\"\n                [disabled]=\"timeLog.isRunning\"\n                [nbTooltip]=\"'TIMESHEET.EDIT' | translate\"\n                [attr.aria-label]=\"'TIMESHEET.EDIT' | translate\"\n                >\n                <nb-icon icon=\"edit-outline\"></nb-icon>\n              </button>\n            </ng-template>\n          </ng-template>\n          <ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ALLOW_DELETE_TIME\">\n            <ng-template ngxTimeTrackingAuthorized [permission]=\"PermissionsEnum.ALLOW_DELETE_TIME\">\n              <button\n                nbButton\n                ghost\n                status=\"basic\"\n                size=\"small\"\n                type=\"button\"\n                class=\"icon-button\"\n                ngxConfirmDialog\n                [message]=\"'TIMESHEET.DELETE_TIMELOG' | translate\"\n                (click)=\"$event.stopPropagation()\"\n                (confirm)=\"onDeleteConfirm(timeLog)\"\n                [disabled]=\"timeLog.isRunning\"\n                [nbTooltip]=\"'TIMESHEET.DELETE' | translate\"\n                [attr.aria-label]=\"'TIMESHEET.DELETE' | translate\"\n                >\n                <nb-icon status=\"danger\" icon=\"trash-2-outline\"></nb-icon>\n              </button>\n            </ng-template>\n          </ng-template>\n        </div>\n      </nb-list-item>\n    }\n  </nb-list>\n\n  <!-- Inside the permission check, so users who cannot add time get no empty footer. -->\n  <ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ALLOW_MANUAL_TIME\">\n    <ng-template ngxTimeTrackingAuthorized [permission]=\"PermissionsEnum.ALLOW_MANUAL_TIME\">\n      <div class=\"time-log-footer\">\n        <button nbButton status=\"primary\" size=\"small\" type=\"button\" (click)=\"openAddByDateProject($event)\">\n          <nb-icon icon=\"plus-outline\"></nb-icon>\n          {{ 'TIMESHEET.ADD_TIME' | translate }}\n        </button>\n      </div>\n    </ng-template>\n  </ng-template>\n</div>\n", styles: [":host{display:block}:host .time-log-popover{width:25rem;max-width:calc(100vw - 2rem);padding-bottom:.5rem}:host .time-log-header{display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.5rem .5rem .5rem 1rem;border-bottom:1px solid var(--gauzy-border-default-color)}:host .time-log-title{font-size:12px;font-weight:600;line-height:1rem;color:var(--text-primary-color)}:host .icon-button[nbButton]{width:1.75rem;height:1.75rem;min-width:0;margin:0;padding:0}:host .icon-button[nbButton] nb-icon{width:1rem;height:1rem;margin:0;font-size:1rem}:host .time-log-list{max-height:50vh;overflow-x:hidden;overflow-y:auto!important}:host nb-list-item.time-log-row{display:flex;align-items:center;gap:.75rem;padding:.625rem .5rem .625rem 1rem;border-top:none;border-bottom:1px solid var(--gauzy-border-default-color)}:host nb-list-item.time-log-row:last-child{border-bottom:none}:host .time-log-details{display:flex;flex:1 1 auto;flex-direction:column;align-items:flex-start;gap:.375rem;min-width:0}:host .time-log-range{font-size:12px;font-weight:600;line-height:1rem;white-space:nowrap;font-variant-numeric:tabular-nums;color:var(--gauzy-text-color-1)}@media(max-width:30rem){:host .time-log-range{white-space:normal}}:host .time-log-duration{flex:none;padding:.125rem .5rem;border-radius:var(--border-radius);background:var(--gauzy-sidebar-background-3);font-size:12px;font-weight:600;line-height:1rem;font-variant-numeric:tabular-nums;color:var(--gauzy-text-color-1)}:host .time-log-actions{display:flex;flex:none;align-items:center;gap:.25rem}:host .time-log-footer{display:flex;justify-content:flex-end;padding:.75rem 1rem;border-top:1px solid var(--gauzy-border-default-color)}:host .time-log-footer button{margin:0}\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogService }, { type: i2.TimesheetService }, { type: i2.Store }, { type: i2.TimeTrackerService }], propDecorators: { timeLogs: [{
                type: Input
            }], callback: [{
                type: Input
            }], close: [{
                type: Output
            }] } });
//# sourceMappingURL=view-time-log.component.js.map