import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@nebular/theme";
import * as i3 from "../../directives/img.directive";
export class CreatedByUserComponent {
    constructor(router) {
        this.router = router;
    }
    /**
     * Resolves the *employee* id of the given user, if the user has an employee profile.
     *
     * `createdByUser.id` is a user id, while `/pages/employees/edit/:id` is keyed by employee id —
     * navigating with the former resolves to nothing and silently bounces back to Manage Employees.
     *
     * @param user - The user who created the record.
     * @returns The employee id, or `undefined` when the user has no employee profile.
     */
    employeeId(user) {
        return user?.employee?.id ?? user?.employeeId;
    }
    /**
     * Navigates to the employee edit page of the given user, when that user is an employee.
     *
     * @param user - The user who created the record.
     */
    edit(user) {
        const employeeId = this.employeeId(user);
        if (!employeeId) {
            // Not an employee (an admin, for example) — there is no employee page to open.
            return;
        }
        this.router.navigate([`/pages/employees/edit/${employeeId}`]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CreatedByUserComponent, deps: [{ token: i1.Router }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CreatedByUserComponent, isStandalone: false, selector: "ngx-created-by-user", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "<div class=\"avatar-container\">\n  @if (rowData?.createdByUser; as createdByUser) {\n    <a\n      class=\"avatar\"\n      [class.is-link]=\"!!employeeId(createdByUser)\"\n      [nbTooltip]=\"createdByUser.name\"\n      (click)=\"edit(createdByUser)\"\n    >\n      @if (createdByUser.imageUrl) {\n        <!-- Without the guard an avatar-less creator renders a broken-image icon. -->\n        <img class=\"img\" type=\"createdByUser\" [src]=\"createdByUser.imageUrl\" [alt]=\"createdByUser.name\" />\n      }\n      <div class=\"names-wrapper\">{{ createdByUser.name }}</div>\n    </a>\n  } @else {\n    <div class=\"names-wrapper\">{{ value }}</div>\n  }\n</div>\n", styles: [":host .avatar-container{width:100%;min-width:0}:host .avatar-container .avatar{display:inline-flex;align-items:center;gap:var(--gauzy-people-gap);min-width:0;max-width:100%;color:var(--text-basic-color);font-size:var(--gauzy-people-font-size);line-height:var(--gauzy-people-avatar-size);text-decoration:none}:host .avatar-container .avatar .names-wrapper{min-width:0;max-width:var(--gauzy-people-name-max-width);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host .avatar-container .avatar img{flex:0 0 auto;width:var(--gauzy-people-avatar-size);height:var(--gauzy-people-avatar-size);border-radius:50%;object-fit:cover}:host a.is-link{cursor:pointer}:host a.is-link:hover{color:var(--text-primary-color)}:host a.is-link:hover .names-wrapper{text-decoration:underline}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i3.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CreatedByUserComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-created-by-user', standalone: false, template: "<div class=\"avatar-container\">\n  @if (rowData?.createdByUser; as createdByUser) {\n    <a\n      class=\"avatar\"\n      [class.is-link]=\"!!employeeId(createdByUser)\"\n      [nbTooltip]=\"createdByUser.name\"\n      (click)=\"edit(createdByUser)\"\n    >\n      @if (createdByUser.imageUrl) {\n        <!-- Without the guard an avatar-less creator renders a broken-image icon. -->\n        <img class=\"img\" type=\"createdByUser\" [src]=\"createdByUser.imageUrl\" [alt]=\"createdByUser.name\" />\n      }\n      <div class=\"names-wrapper\">{{ createdByUser.name }}</div>\n    </a>\n  } @else {\n    <div class=\"names-wrapper\">{{ value }}</div>\n  }\n</div>\n", styles: [":host .avatar-container{width:100%;min-width:0}:host .avatar-container .avatar{display:inline-flex;align-items:center;gap:var(--gauzy-people-gap);min-width:0;max-width:100%;color:var(--text-basic-color);font-size:var(--gauzy-people-font-size);line-height:var(--gauzy-people-avatar-size);text-decoration:none}:host .avatar-container .avatar .names-wrapper{min-width:0;max-width:var(--gauzy-people-name-max-width);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host .avatar-container .avatar img{flex:0 0 auto;width:var(--gauzy-people-avatar-size);height:var(--gauzy-people-avatar-size);border-radius:50%;object-fit:cover}:host a.is-link{cursor:pointer}:host a.is-link:hover{color:var(--text-primary-color)}:host a.is-link:hover .names-wrapper{text-decoration:underline}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Router }], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=created-by-user.component.js.map