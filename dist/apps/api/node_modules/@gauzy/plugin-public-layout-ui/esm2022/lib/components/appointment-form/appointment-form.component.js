import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { firstValueFrom, switchMap } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EmployeesService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@nebular/theme";
import * as i5 from "@gauzy/ui-core/shared";
let AppointmentFormComponent = class AppointmentFormComponent extends TranslationBaseComponent {
    constructor(translateService, route, router, employeeService) {
        super(translateService);
        this.translateService = translateService;
        this.route = route;
        this.router = router;
        this.employeeService = employeeService;
        this.loading = true;
    }
    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.selectedRange = {
                start: params.dateStart,
                end: params.dateEnd
            };
        });
        this.route.params
            .pipe(switchMap(async (params) => {
            if (!params.id)
                return;
            try {
                // Get employee by ID
                this.employee = await firstValueFrom(this.employeeService.getEmployeeById(params.id, ['user']));
                this.selectedEventType = history.state.selectedEventType;
                if (this.selectedEventType) {
                    this.allowedDuration = this.calculateAllowedDuration(this.selectedEventType);
                    this.loading = false;
                }
                else {
                    history.go(-1);
                }
            }
            catch (error) {
                console.log('Error while loading employee', error);
                await this.router.navigate(['/share/404']);
            }
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Calculate allowed duration in minutes
     *
     * @param eventType
     * @returns
     */
    calculateAllowedDuration(eventType) {
        switch (eventType.durationUnit) {
            case 'Day(s)':
                return eventType.duration * 24 * 60;
            case 'Hour(s)':
                return eventType.duration * 60;
            default:
                return eventType.duration * 1;
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppointmentFormComponent, deps: [{ token: i1.TranslateService }, { token: i2.ActivatedRoute }, { token: i2.Router }, { token: i3.EmployeesService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: AppointmentFormComponent, isStandalone: false, selector: "ng-component", usesInheritance: true, ngImport: i0, template: "<!--  -->\n<nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n  @if (employee) {\n    <ga-manage-appointment\n      [employee]=\"employee\"\n      [selectedRange]=\"selectedRange\"\n      [hidePrivateFields]=\"true\"\n      [allowedDuration]=\"allowedDuration\"\n      [disabled]=\"true\"\n    ></ga-manage-appointment>\n  }\n</nb-card>\n", dependencies: [{ kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: i5.ManageAppointmentComponent, selector: "ga-manage-appointment", inputs: ["employee", "employeeAppointment", "disabled", "appointmentId", "allowedDuration", "hidePrivateFields", "timezone", "selectedRange"], outputs: ["save", "cancel"] }] }); }
};
AppointmentFormComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [TranslateService,
        ActivatedRoute,
        Router,
        EmployeesService])
], AppointmentFormComponent);
export { AppointmentFormComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppointmentFormComponent, decorators: [{
            type: Component,
            args: [{ standalone: false, template: "<!--  -->\n<nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n  @if (employee) {\n    <ga-manage-appointment\n      [employee]=\"employee\"\n      [selectedRange]=\"selectedRange\"\n      [hidePrivateFields]=\"true\"\n      [allowedDuration]=\"allowedDuration\"\n      [disabled]=\"true\"\n    ></ga-manage-appointment>\n  }\n</nb-card>\n" }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.ActivatedRoute }, { type: i2.Router }, { type: i3.EmployeesService }] });
//# sourceMappingURL=appointment-form.component.js.map