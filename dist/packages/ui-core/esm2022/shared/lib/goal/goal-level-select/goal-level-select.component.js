import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { GoalLevelEnum } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { OrganizationTeamsService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
import * as i4 from "../../employee/employee-multi-select/employee-multi-select.component";
import * as i5 from "@angular/common";
import * as i6 from "@ngx-translate/core";
export class GoalLevelSelectComponent {
    constructor(organizationTeamsService, store) {
        this.organizationTeamsService = organizationTeamsService;
        this.store = store;
        this.teams = [];
        this.hideOrg = false;
        this.hideEmployee = false;
        this.hideTeam = false;
        this.helperText = '';
        this.enableHelperText = false;
        this.alignedGoal = false;
        this.goalLevelEnum = GoalLevelEnum;
    }
    async getTeams() {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.store.selectedOrganization;
        this.teams = (await this.organizationTeamsService.getAll(['members'], {
            organizationId,
            tenantId
        })).items;
    }
    selectEmployee(event, control) {
        if (this.alignedGoal) {
            this.parentFormGroup.patchValue({ alignedGoalOwner: event });
        }
        else {
            if (control === 'lead' && event !== '') {
                this.parentFormGroup.patchValue({ leadId: event });
            }
            else {
                this.parentFormGroup.patchValue({ ownerId: event });
            }
        }
    }
    onLevelChange(selectedLevel) {
        this.parentFormGroup.patchValue({ level: selectedLevel });
        if (selectedLevel === this.goalLevelEnum.TEAM) {
            this.getTeams();
        }
    }
    isLevelHidden(level) {
        return ((this.hideOrg && level === this.goalLevelEnum.ORGANIZATION) ||
            (this.hideEmployee && level === this.goalLevelEnum.EMPLOYEE) ||
            (this.hideTeam && level === this.goalLevelEnum.TEAM));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalLevelSelectComponent, deps: [{ token: i1.OrganizationTeamsService }, { token: i1.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: GoalLevelSelectComponent, isStandalone: false, selector: "ga-goal-level-select", inputs: { parentFormGroup: "parentFormGroup", orgId: "orgId", teams: "teams", hideOrg: "hideOrg", hideEmployee: "hideEmployee", hideTeam: "hideTeam", helperText: "helperText", employees: "employees", orgName: "orgName", enableHelperText: "enableHelperText", alignedGoal: "alignedGoal" }, ngImport: i0, template: "@if (alignedGoal ? !!parentFormGroup.value.assignAsObjective : true) {\n<div [formGroup]=\"parentFormGroup\">\n\t<div [class.row]=\"enableHelperText\">\n\t\t<div\n\t\t\t[class.col-md-7]=\"enableHelperText\"\n\t\t\t(mouseenter)=\"enableHelperText ? (helperText = 'objective-level') : null\"\n\t\t\t(mouseleave)=\"enableHelperText ? (helperText = '') : null\"\n\t\t>\n\t\t\t<label for=\"objective-level\" class=\"label mt-3\">\n\t\t\t\t{{ 'GOALS_PAGE.FORM.LABELS.LEVEL' | translate }}\n\t\t\t</label>\n\t\t\t<nb-select\n\t\t\t\tid=\"objective-level\"\n\t\t\t\tformControlName=\"level\"\n\t\t\t\t[placeholder]=\"'GOALS_PAGE.FORM.PLACEHOLDERS.LEVEL' | translate\"\n\t\t\t\t(selectedChange)=\"onLevelChange($event)\"\n\t\t\t\tfullWidth\n\t\t\t>\n\t\t\t\t@for (level of goalLevelEnum | keyvalue; track level) {\n\t\t\t\t<nb-option [hidden]=\"isLevelHidden(level.value)\" [value]=\"level.value\">\n\t\t\t\t\t{{ 'GOALS_PAGE.LEVELS.' + level.key | translate }}\n\t\t\t\t</nb-option>\n\t\t\t\t}\n\t\t\t</nb-select>\n\t\t</div>\n\t\t<div class=\"col-md-5 position-relative helper-text\">\n\t\t\t@if (helperText == 'objective-level') {\n\t\t\t<div class=\"mt-3 position-absolute\">\n\t\t\t\t<p>\n\t\t\t\t\t{{ 'GOALS_PAGE.HELPER_TEXT.OBJECTIVE_LEVEL' | translate }}\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n\t<div [class.row]=\"enableHelperText\">\n\t\t@if (alignedGoal ? !!parentFormGroup.value.level : true) {\n\t\t<div\n\t\t\t[class.col-md-7]=\"enableHelperText\"\n\t\t\t(mouseenter)=\"enableHelperText ? (helperText = 'objective-owner') : null\"\n\t\t\t(mouseleave)=\"enableHelperText ? (helperText = '') : null\"\n\t\t>\n\t\t\t<label for=\"objective-owner\" class=\"label mt-3\">\n\t\t\t\t{{ 'KEY_RESULT_PAGE.FORM.LABELS.OWNER' | translate }}\n\t\t\t</label>\n\t\t\t@if (parentFormGroup.value.level === goalLevelEnum.EMPLOYEE) {\n\t\t\t<ga-employee-multi-select\n\t\t\t\t[multiple]=\"false\"\n\t\t\t\t[allEmployees]=\"employees\"\n\t\t\t\t[selectedEmployeeIds]=\"parentFormGroup.value.owner\"\n\t\t\t\t[label]=\"false\"\n\t\t\t\t(selectedChange)=\"selectEmployee($event, 'owner')\"\n\t\t\t\tid=\"key-result-owner\"\n\t\t\t\tplaceholder=\"{{ 'GOALS_PAGE.FORM.LABELS.OWNER' | translate }}\"\n\t\t\t\tclass=\"header-selector employee-selector\"\n\t\t\t></ga-employee-multi-select>\n\t\t\t}\n\t\t</div>\n\t\t}\n\t\t<div class=\"col-md-5 position-relative helper-text\">\n\t\t\t@if (helperText == 'objective-owner') {\n\t\t\t<div class=\"mt-3 position-absolute\">\n\t\t\t\t<p>\n\t\t\t\t\t{{ 'GOALS_PAGE.HELPER_TEXT.OBJECTIVE_OWNER' | translate }}\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n\t<div [class.row]=\"enableHelperText\">\n\t\t@if (parentFormGroup.value.level === goalLevelEnum.TEAM) {\n\t\t<div\n\t\t\t(selectedChange)=\"selectEmployee($event, 'owner')\"\n\t\t\t[class.col-md-7]=\"enableHelperText\"\n\t\t\t(mouseenter)=\"enableHelperText ? (helperText = 'objective-owner') : null\"\n\t\t\t(mouseleave)=\"enableHelperText ? (helperText = '') : null\"\n\t\t>\n\t\t\t<nb-select\n\t\t\t\tformControlName=\"ownerId\"\n\t\t\t\tfullWidth\n\t\t\t\tplaceholder=\"{{ 'GOALS_PAGE.FORM.LABELS.OWNER' | translate }}\"\n\t\t\t>\n\t\t\t\t@for (team of teams; track team) {\n\t\t\t\t<nb-option [value]=\"team.id\">\n\t\t\t\t\t{{ team.name }}\n\t\t\t\t</nb-option>\n\t\t\t\t}\n\t\t\t</nb-select>\n\t\t</div>\n\t\t}\n\t\t<div class=\"col-md-5\"></div>\n\t</div>\n\t<div [class.row]=\"enableHelperText\">\n\t\t@if (parentFormGroup?.value.level === goalLevelEnum.ORGANIZATION) {\n\t\t<div\n\t\t\t[class.col-md-7]=\"enableHelperText\"\n\t\t\t(mouseenter)=\"enableHelperText ? (helperText = 'objective-owner') : null\"\n\t\t\t(mouseleave)=\"enableHelperText ? (helperText = '') : null\"\n\t\t>\n\t\t\t<nb-select\n\t\t\t\tfullWidth\n\t\t\t\tformControlName=\"ownerId\"\n\t\t\t\tplaceholder=\"{{ 'GOALS_PAGE.FORM.LABELS.OWNER' | translate }}\"\n\t\t\t\t[(selected)]=\"orgId\"\n\t\t\t\t(selectedChange)=\"selectEmployee($event, 'owner')\"\n\t\t\t>\n\t\t\t\t<nb-option [(value)]=\"orgId\">\n\t\t\t\t\t{{ orgName }}\n\t\t\t\t</nb-option>\n\t\t\t</nb-select>\n\t\t</div>\n\t\t}\n\t\t<div class=\"col-md-5\"></div>\n\t</div>\n\t@if (!alignedGoal) {\n\t<div [class.row]=\"enableHelperText\">\n\t\t<div\n\t\t\t[class.col-md-7]=\"enableHelperText\"\n\t\t\t(mouseenter)=\"enableHelperText ? (helperText = 'objective-lead') : null\"\n\t\t\t(mouseleave)=\"enableHelperText ? (helperText = '') : null\"\n\t\t>\n\t\t\t<label for=\"objective-lead\" class=\"label mt-3\">\n\t\t\t\t{{ 'GOALS_PAGE.FORM.LABELS.LEAD_OPTIONAL' | translate }}\n\t\t\t</label>\n\t\t\t<ga-employee-multi-select\n\t\t\t\t[multiple]=\"false\"\n\t\t\t\t[allEmployees]=\"employees\"\n\t\t\t\t[selectedEmployeeIds]=\"parentFormGroup.value.leadId\"\n\t\t\t\t[label]=\"false\"\n\t\t\t\t(selectedChange)=\"selectEmployee($event, 'lead')\"\n\t\t\t\tid=\"objective-lead\"\n\t\t\t\tplaceholder=\"{{ 'GOALS_PAGE.FORM.LABELS.LEAD_OPTIONAL' | translate }}\"\n\t\t\t\tclass=\"header-selector employee-selector\"\n\t\t\t></ga-employee-multi-select>\n\t\t</div>\n\t\t<div class=\"col-md-5 position-relative helper-text\">\n\t\t\t@if (helperText == 'objective-lead') {\n\t\t\t<div class=\"mt-3 position-absolute\">\n\t\t\t\t<p>\n\t\t\t\t\t{{ 'GOALS_PAGE.HELPER_TEXT.OBJECTIVE_LEAD' | translate }}\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n\t}\n</div>\n}\n", styles: [""], dependencies: [{ kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i3.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i3.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i4.EmployeeSelectComponent, selector: "ga-employee-multi-select", inputs: ["reset", "allEmployees", "selectedEmployeeIds", "multiple", "label", "disabled", "placeholder"], outputs: ["selectedChange", "onLoadEmployees"] }, { kind: "pipe", type: i5.KeyValuePipe, name: "keyvalue" }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalLevelSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-goal-level-select', standalone: false, template: "@if (alignedGoal ? !!parentFormGroup.value.assignAsObjective : true) {\n<div [formGroup]=\"parentFormGroup\">\n\t<div [class.row]=\"enableHelperText\">\n\t\t<div\n\t\t\t[class.col-md-7]=\"enableHelperText\"\n\t\t\t(mouseenter)=\"enableHelperText ? (helperText = 'objective-level') : null\"\n\t\t\t(mouseleave)=\"enableHelperText ? (helperText = '') : null\"\n\t\t>\n\t\t\t<label for=\"objective-level\" class=\"label mt-3\">\n\t\t\t\t{{ 'GOALS_PAGE.FORM.LABELS.LEVEL' | translate }}\n\t\t\t</label>\n\t\t\t<nb-select\n\t\t\t\tid=\"objective-level\"\n\t\t\t\tformControlName=\"level\"\n\t\t\t\t[placeholder]=\"'GOALS_PAGE.FORM.PLACEHOLDERS.LEVEL' | translate\"\n\t\t\t\t(selectedChange)=\"onLevelChange($event)\"\n\t\t\t\tfullWidth\n\t\t\t>\n\t\t\t\t@for (level of goalLevelEnum | keyvalue; track level) {\n\t\t\t\t<nb-option [hidden]=\"isLevelHidden(level.value)\" [value]=\"level.value\">\n\t\t\t\t\t{{ 'GOALS_PAGE.LEVELS.' + level.key | translate }}\n\t\t\t\t</nb-option>\n\t\t\t\t}\n\t\t\t</nb-select>\n\t\t</div>\n\t\t<div class=\"col-md-5 position-relative helper-text\">\n\t\t\t@if (helperText == 'objective-level') {\n\t\t\t<div class=\"mt-3 position-absolute\">\n\t\t\t\t<p>\n\t\t\t\t\t{{ 'GOALS_PAGE.HELPER_TEXT.OBJECTIVE_LEVEL' | translate }}\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n\t<div [class.row]=\"enableHelperText\">\n\t\t@if (alignedGoal ? !!parentFormGroup.value.level : true) {\n\t\t<div\n\t\t\t[class.col-md-7]=\"enableHelperText\"\n\t\t\t(mouseenter)=\"enableHelperText ? (helperText = 'objective-owner') : null\"\n\t\t\t(mouseleave)=\"enableHelperText ? (helperText = '') : null\"\n\t\t>\n\t\t\t<label for=\"objective-owner\" class=\"label mt-3\">\n\t\t\t\t{{ 'KEY_RESULT_PAGE.FORM.LABELS.OWNER' | translate }}\n\t\t\t</label>\n\t\t\t@if (parentFormGroup.value.level === goalLevelEnum.EMPLOYEE) {\n\t\t\t<ga-employee-multi-select\n\t\t\t\t[multiple]=\"false\"\n\t\t\t\t[allEmployees]=\"employees\"\n\t\t\t\t[selectedEmployeeIds]=\"parentFormGroup.value.owner\"\n\t\t\t\t[label]=\"false\"\n\t\t\t\t(selectedChange)=\"selectEmployee($event, 'owner')\"\n\t\t\t\tid=\"key-result-owner\"\n\t\t\t\tplaceholder=\"{{ 'GOALS_PAGE.FORM.LABELS.OWNER' | translate }}\"\n\t\t\t\tclass=\"header-selector employee-selector\"\n\t\t\t></ga-employee-multi-select>\n\t\t\t}\n\t\t</div>\n\t\t}\n\t\t<div class=\"col-md-5 position-relative helper-text\">\n\t\t\t@if (helperText == 'objective-owner') {\n\t\t\t<div class=\"mt-3 position-absolute\">\n\t\t\t\t<p>\n\t\t\t\t\t{{ 'GOALS_PAGE.HELPER_TEXT.OBJECTIVE_OWNER' | translate }}\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n\t<div [class.row]=\"enableHelperText\">\n\t\t@if (parentFormGroup.value.level === goalLevelEnum.TEAM) {\n\t\t<div\n\t\t\t(selectedChange)=\"selectEmployee($event, 'owner')\"\n\t\t\t[class.col-md-7]=\"enableHelperText\"\n\t\t\t(mouseenter)=\"enableHelperText ? (helperText = 'objective-owner') : null\"\n\t\t\t(mouseleave)=\"enableHelperText ? (helperText = '') : null\"\n\t\t>\n\t\t\t<nb-select\n\t\t\t\tformControlName=\"ownerId\"\n\t\t\t\tfullWidth\n\t\t\t\tplaceholder=\"{{ 'GOALS_PAGE.FORM.LABELS.OWNER' | translate }}\"\n\t\t\t>\n\t\t\t\t@for (team of teams; track team) {\n\t\t\t\t<nb-option [value]=\"team.id\">\n\t\t\t\t\t{{ team.name }}\n\t\t\t\t</nb-option>\n\t\t\t\t}\n\t\t\t</nb-select>\n\t\t</div>\n\t\t}\n\t\t<div class=\"col-md-5\"></div>\n\t</div>\n\t<div [class.row]=\"enableHelperText\">\n\t\t@if (parentFormGroup?.value.level === goalLevelEnum.ORGANIZATION) {\n\t\t<div\n\t\t\t[class.col-md-7]=\"enableHelperText\"\n\t\t\t(mouseenter)=\"enableHelperText ? (helperText = 'objective-owner') : null\"\n\t\t\t(mouseleave)=\"enableHelperText ? (helperText = '') : null\"\n\t\t>\n\t\t\t<nb-select\n\t\t\t\tfullWidth\n\t\t\t\tformControlName=\"ownerId\"\n\t\t\t\tplaceholder=\"{{ 'GOALS_PAGE.FORM.LABELS.OWNER' | translate }}\"\n\t\t\t\t[(selected)]=\"orgId\"\n\t\t\t\t(selectedChange)=\"selectEmployee($event, 'owner')\"\n\t\t\t>\n\t\t\t\t<nb-option [(value)]=\"orgId\">\n\t\t\t\t\t{{ orgName }}\n\t\t\t\t</nb-option>\n\t\t\t</nb-select>\n\t\t</div>\n\t\t}\n\t\t<div class=\"col-md-5\"></div>\n\t</div>\n\t@if (!alignedGoal) {\n\t<div [class.row]=\"enableHelperText\">\n\t\t<div\n\t\t\t[class.col-md-7]=\"enableHelperText\"\n\t\t\t(mouseenter)=\"enableHelperText ? (helperText = 'objective-lead') : null\"\n\t\t\t(mouseleave)=\"enableHelperText ? (helperText = '') : null\"\n\t\t>\n\t\t\t<label for=\"objective-lead\" class=\"label mt-3\">\n\t\t\t\t{{ 'GOALS_PAGE.FORM.LABELS.LEAD_OPTIONAL' | translate }}\n\t\t\t</label>\n\t\t\t<ga-employee-multi-select\n\t\t\t\t[multiple]=\"false\"\n\t\t\t\t[allEmployees]=\"employees\"\n\t\t\t\t[selectedEmployeeIds]=\"parentFormGroup.value.leadId\"\n\t\t\t\t[label]=\"false\"\n\t\t\t\t(selectedChange)=\"selectEmployee($event, 'lead')\"\n\t\t\t\tid=\"objective-lead\"\n\t\t\t\tplaceholder=\"{{ 'GOALS_PAGE.FORM.LABELS.LEAD_OPTIONAL' | translate }}\"\n\t\t\t\tclass=\"header-selector employee-selector\"\n\t\t\t></ga-employee-multi-select>\n\t\t</div>\n\t\t<div class=\"col-md-5 position-relative helper-text\">\n\t\t\t@if (helperText == 'objective-lead') {\n\t\t\t<div class=\"mt-3 position-absolute\">\n\t\t\t\t<p>\n\t\t\t\t\t{{ 'GOALS_PAGE.HELPER_TEXT.OBJECTIVE_LEAD' | translate }}\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n\t}\n</div>\n}\n" }]
        }], ctorParameters: () => [{ type: i1.OrganizationTeamsService }, { type: i1.Store }], propDecorators: { parentFormGroup: [{
                type: Input
            }], orgId: [{
                type: Input
            }], teams: [{
                type: Input
            }], hideOrg: [{
                type: Input
            }], hideEmployee: [{
                type: Input
            }], hideTeam: [{
                type: Input
            }], helperText: [{
                type: Input
            }], employees: [{
                type: Input
            }], orgName: [{
                type: Input
            }], enableHelperText: [{
                type: Input
            }], alignedGoal: [{
                type: Input
            }] } });
//# sourceMappingURL=goal-level-select.component.js.map