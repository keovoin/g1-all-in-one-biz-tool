import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../people-list/people-list.component";
import * as i3 from "@ngx-translate/core";
/**
 * The members block of a project card (Organization → Projects, cards layout).
 *
 * Uses the same `ngx-people-list` treatment as the grid columns so the two
 * layouts of the same page render people identically; the card only lets the
 * group wrap and name more people, because it has the room.
 */
export class ProjectOrganizationEmployeesComponent {
    constructor(router) {
        this.router = router;
    }
    /**
     * Navigates to the employee edit page of the clicked person.
     *
     * @param person - The person that was clicked in the list.
     */
    edit(person) {
        const id = person?.id;
        if (id) {
            this.router.navigate([`/pages/employees/edit/${id}`]);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectOrganizationEmployeesComponent, deps: [{ token: i1.Router }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProjectOrganizationEmployeesComponent, isStandalone: false, selector: "gauzy-project-organization-employees", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "@if (rowData?.members?.length > 0) {\n\t<div class=\"members\">\n\t\t<div class=\"members-title\">\n\t\t\t{{ 'ORGANIZATIONS_PAGE.EDIT.MEMBERS' | translate }}\n\t\t</div>\n\t\t<!--\n\t\t\tSame people treatment as the grid columns, only allowed to wrap and to\n\t\t\tname more people, because a card has the room a table cell does not.\n\t\t-->\n\t\t<ngx-people-list\n\t\t\t[people]=\"rowData.members\"\n\t\t\t[maxNames]=\"6\"\n\t\t\t[maxAvatars]=\"6\"\n\t\t\t[wrap]=\"true\"\n\t\t\t(selectPerson)=\"edit($event)\"\n\t\t></ngx-people-list>\n\t</div>\n}\n", styles: [".members{background-color:var(--gauzy-card-1, var(--card-background-color));border-radius:var(--border-radius);padding:.625rem;margin:0}.members-title{margin-bottom:.5rem;font-size:var(--text-label-font-size);font-weight:600;line-height:.9375rem;letter-spacing:0em;color:var(--gauzy-text-color-2, var(--text-hint-color))}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i2.PeopleListComponent, selector: "ngx-people-list", inputs: ["people", "maxNames", "maxAvatars", "wrap"], outputs: ["selectPerson"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectOrganizationEmployeesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-project-organization-employees', standalone: false, template: "@if (rowData?.members?.length > 0) {\n\t<div class=\"members\">\n\t\t<div class=\"members-title\">\n\t\t\t{{ 'ORGANIZATIONS_PAGE.EDIT.MEMBERS' | translate }}\n\t\t</div>\n\t\t<!--\n\t\t\tSame people treatment as the grid columns, only allowed to wrap and to\n\t\t\tname more people, because a card has the room a table cell does not.\n\t\t-->\n\t\t<ngx-people-list\n\t\t\t[people]=\"rowData.members\"\n\t\t\t[maxNames]=\"6\"\n\t\t\t[maxAvatars]=\"6\"\n\t\t\t[wrap]=\"true\"\n\t\t\t(selectPerson)=\"edit($event)\"\n\t\t></ngx-people-list>\n\t</div>\n}\n", styles: [".members{background-color:var(--gauzy-card-1, var(--card-background-color));border-radius:var(--border-radius);padding:.625rem;margin:0}.members-title{margin-bottom:.5rem;font-size:var(--text-label-font-size);font-weight:600;line-height:.9375rem;letter-spacing:0em;color:var(--gauzy-text-color-2, var(--text-hint-color))}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Router }], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=project-organization-employees.component.js.map