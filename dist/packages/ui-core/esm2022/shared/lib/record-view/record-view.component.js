import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../status-badge/status-badge.component";
import * as i3 from "../table-components/employee-with-links/employee-with-links.component";
import * as i4 from "../table-components/income-amount/income-amount.component";
import * as i5 from "../table-components/tags-only/tags-only.component";
import * as i6 from "../table-components/task-teams/task-teams.component";
import * as i7 from "ngx-permissions";
import * as i8 from "../pipes/date-format.pipe";
import * as i9 from "../pipes/datetime-format.pipe";
import * as i10 from "@ngx-translate/core";
/**
 * Read-only rendering of one record as label/value pairs, driven by a field
 * descriptor list. It never edits and never navigates on its own.
 *
 * @see IRecordViewField for the descriptor shape.
 */
export class RecordViewComponent {
    constructor() {
        this.sections = [];
        /** Shown for rows kept via `showWhenEmpty`. */
        this.placeholder = '—';
        this.resolved = [];
    }
    ngOnChanges(changes) {
        if (changes['record'] || changes['sections']) {
            this.resolved = this.build();
        }
    }
    /**
     * Resolve the descriptor against the record ONCE per change. The template is
     * then free of method calls, which keeps object identities (the `ga-only-tags`
     * host, the normalized person) stable across change detection.
     */
    build() {
        return (this.sections || [])
            .map((section) => ({
            title: section.title,
            rows: (section.fields || [])
                .map((field) => this.toRow(field))
                .filter((row) => !row.isEmpty || !!row.field.showWhenEmpty)
        }))
            .filter((section) => section.rows.length > 0);
    }
    /**
     * Build one row: resolve the value, decide whether it counts as empty, and
     * pre-shape whatever the chosen renderer needs.
     */
    toRow(field) {
        const type = field.type || 'text';
        const value = field.value !== undefined ? field.value : this.resolve(field.key);
        const row = { field, type, value, isEmpty: RecordViewComponent.isEmpty(value) };
        if (type === 'tags') {
            row.tagsHost = { tags: Array.isArray(value) ? value : [] };
        }
        else if (type === 'person') {
            row.person = RecordViewComponent.toPerson(value);
            row.isEmpty = !row.person;
        }
        return row;
    }
    /**
     * Walks a dot path into the record. Returns `undefined` rather than throwing
     * when an intermediate link is missing — a half-populated relation is normal
     * for records loaded with a narrow `relations` list.
     */
    resolve(path) {
        if (!path || !this.record) {
            return undefined;
        }
        return path
            .split('.')
            .reduce((acc, part) => (acc === null || acc === undefined ? acc : acc[part]), this.record);
    }
    /** `false` and `0` are values, not blanks — only null/undefined/''/[] are. */
    static isEmpty(value) {
        if (value === null || value === undefined || value === '') {
            return true;
        }
        return Array.isArray(value) && value.length === 0;
    }
    /**
     * Accepts an employee, a user or a plain `{ name }` and flattens it to what
     * the person renderer needs, so callers do not have to know which of the
     * three a given relation gives them.
     */
    static toPerson(value) {
        if (!value) {
            return undefined;
        }
        const user = value.user || value;
        const name = value.fullName ||
            value.name ||
            [user.firstName, user.lastName].filter(Boolean).join(' ') ||
            user.name ||
            user.email;
        return name ? { id: value.id, name, imageUrl: value.imageUrl || user.imageUrl } : undefined;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordViewComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: RecordViewComponent, isStandalone: false, selector: "ngx-record-view", inputs: { record: "record", sections: "sections", placeholder: "placeholder" }, usesOnChanges: true, ngImport: i0, template: "@for (section of resolved; track $index) {\n\t<section class=\"record-section\">\n\t\t@if (section.title) {\n\t\t\t<h6 class=\"record-section-title\">{{ section.title | translate }}</h6>\n\t\t}\n\t\t<dl class=\"record-rows\">\n\t\t\t@for (row of section.rows; track $index) {\n\t\t\t\t<!-- A row may narrow the record's own guard, never widen it. -->\n\t\t\t\t@if (row.field.permission) {\n\t\t\t\t\t<ng-template [ngxPermissionsOnly]=\"row.field.permission\">\n\t\t\t\t\t\t<ng-container *ngTemplateOutlet=\"recordRow; context: { $implicit: row }\"></ng-container>\n\t\t\t\t\t</ng-template>\n\t\t\t\t} @else {\n\t\t\t\t\t<ng-container *ngTemplateOutlet=\"recordRow; context: { $implicit: row }\"></ng-container>\n\t\t\t\t}\n\t\t\t}\n\t\t</dl>\n\t</section>\n}\n\n<ng-template #recordRow let-row>\n\t<div class=\"record-row\" [class.wide]=\"row.field.wide\">\n\t\t<dt class=\"record-label\">{{ row.field.label | translate }}</dt>\n\t\t<dd class=\"record-value\">\n\t\t\t@if (row.isEmpty) {\n\t\t\t\t<span class=\"record-empty\">{{ placeholder }}</span>\n\t\t\t} @else {\n\t\t\t\t@switch (row.type) {\n\t\t\t\t\t@case ('tags') {\n\t\t\t\t\t\t<ga-only-tags [rowData]=\"row.tagsHost\"></ga-only-tags>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('people') {\n\t\t\t\t\t\t<ngx-employee-with-links [value]=\"row.value\"></ngx-employee-with-links>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('teams') {\n\t\t\t\t\t\t<ngx-task-teams [value]=\"row.value\"></ngx-task-teams>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('person') {\n\t\t\t\t\t\t<span class=\"record-person\">\n\t\t\t\t\t\t\t@if (row.person.imageUrl) {\n\t\t\t\t\t\t\t\t<img class=\"record-person-avatar\" [src]=\"row.person.imageUrl\" alt=\"\" />\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t<span>{{ row.person.name }}</span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('badge') {\n\t\t\t\t\t\t<ga-status-badge [value]=\"row.value\"></ga-status-badge>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('money') {\n\t\t\t\t\t\t<ga-income-amount [value]=\"row.value\" [rowData]=\"record\"></ga-income-amount>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('date') {\n\t\t\t\t\t\t{{ row.value | dateFormat }}\n\t\t\t\t\t}\n\t\t\t\t\t@case ('datetime') {\n\t\t\t\t\t\t{{ row.value | dateTimeFormat }}\n\t\t\t\t\t}\n\t\t\t\t\t@case ('boolean') {\n\t\t\t\t\t\t{{ (row.value ? 'BUTTONS.YES' : 'BUTTONS.NO') | translate }}\n\t\t\t\t\t}\n\t\t\t\t\t@case ('email') {\n\t\t\t\t\t\t<a class=\"record-link\" [href]=\"'mailto:' + row.value\">{{ row.value }}</a>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('phone') {\n\t\t\t\t\t\t<a class=\"record-link\" [href]=\"'tel:' + row.value\">{{ row.value }}</a>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('link') {\n\t\t\t\t\t\t<a\n\t\t\t\t\t\t\tclass=\"record-link\"\n\t\t\t\t\t\t\t[href]=\"row.field.href || row.value\"\n\t\t\t\t\t\t\ttarget=\"_blank\"\n\t\t\t\t\t\t\trel=\"noopener noreferrer\"\n\t\t\t\t\t\t\t>{{ row.value }}</a\n\t\t\t\t\t\t>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('html') {\n\t\t\t\t\t\t<div class=\"record-rich\" [innerHTML]=\"row.value\"></div>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('multiline') {\n\t\t\t\t\t\t<div class=\"record-multiline\">{{ row.value }}</div>\n\t\t\t\t\t}\n\t\t\t\t\t@default {\n\t\t\t\t\t\t{{ row.value }}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t</dd>\n\t</div>\n</ng-template>\n", styles: [":host{display:block;color:var(--text-basic-color)}.record-section+.record-section{margin-top:1.25rem}.record-section-title{margin:0 0 .5rem;font-size:.75rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--text-hint-color)}.record-rows{margin:0}.record-row{display:grid;grid-template-columns:minmax(6.5rem,38%) 1fr;gap:.5rem .75rem;align-items:baseline;padding:.375rem 0;border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.record-row:last-child{border-bottom:none}.record-row.wide{grid-template-columns:1fr;gap:.25rem}.record-label{margin:0;font-size:.75rem;font-weight:500;line-height:1.25rem;color:var(--text-hint-color)}.record-value{margin:0;font-size:.8125rem;line-height:1.25rem;min-width:0;overflow-wrap:anywhere}.record-empty{color:var(--text-disabled-color)}.record-link{color:var(--text-primary-color);text-decoration:none}.record-link:hover{text-decoration:underline}.record-multiline{white-space:pre-wrap}.record-rich :last-child{margin-bottom:0}.record-person{display:inline-flex;align-items:center;gap:.375rem}.record-person-avatar{width:1.25rem;height:1.25rem;border-radius:50%;object-fit:cover}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i2.StatusBadgeComponent, selector: "ga-status-badge", inputs: ["value", "layout"] }, { kind: "component", type: i3.EmployeeWithLinksComponent, selector: "ngx-employee-with-links", inputs: ["rowData", "value"] }, { kind: "component", type: i4.IncomeExpenseAmountComponent, selector: "ga-income-amount" }, { kind: "component", type: i5.TagsOnlyComponent, selector: "ga-only-tags", inputs: ["value"] }, { kind: "component", type: i6.TaskTeamsComponent, selector: "ngx-task-teams", inputs: ["rowData", "value"] }, { kind: "directive", type: i7.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "pipe", type: i8.DateFormatPipe, name: "dateFormat" }, { kind: "pipe", type: i9.DateTimeFormatPipe, name: "dateTimeFormat" }, { kind: "pipe", type: i10.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-record-view', standalone: false, template: "@for (section of resolved; track $index) {\n\t<section class=\"record-section\">\n\t\t@if (section.title) {\n\t\t\t<h6 class=\"record-section-title\">{{ section.title | translate }}</h6>\n\t\t}\n\t\t<dl class=\"record-rows\">\n\t\t\t@for (row of section.rows; track $index) {\n\t\t\t\t<!-- A row may narrow the record's own guard, never widen it. -->\n\t\t\t\t@if (row.field.permission) {\n\t\t\t\t\t<ng-template [ngxPermissionsOnly]=\"row.field.permission\">\n\t\t\t\t\t\t<ng-container *ngTemplateOutlet=\"recordRow; context: { $implicit: row }\"></ng-container>\n\t\t\t\t\t</ng-template>\n\t\t\t\t} @else {\n\t\t\t\t\t<ng-container *ngTemplateOutlet=\"recordRow; context: { $implicit: row }\"></ng-container>\n\t\t\t\t}\n\t\t\t}\n\t\t</dl>\n\t</section>\n}\n\n<ng-template #recordRow let-row>\n\t<div class=\"record-row\" [class.wide]=\"row.field.wide\">\n\t\t<dt class=\"record-label\">{{ row.field.label | translate }}</dt>\n\t\t<dd class=\"record-value\">\n\t\t\t@if (row.isEmpty) {\n\t\t\t\t<span class=\"record-empty\">{{ placeholder }}</span>\n\t\t\t} @else {\n\t\t\t\t@switch (row.type) {\n\t\t\t\t\t@case ('tags') {\n\t\t\t\t\t\t<ga-only-tags [rowData]=\"row.tagsHost\"></ga-only-tags>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('people') {\n\t\t\t\t\t\t<ngx-employee-with-links [value]=\"row.value\"></ngx-employee-with-links>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('teams') {\n\t\t\t\t\t\t<ngx-task-teams [value]=\"row.value\"></ngx-task-teams>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('person') {\n\t\t\t\t\t\t<span class=\"record-person\">\n\t\t\t\t\t\t\t@if (row.person.imageUrl) {\n\t\t\t\t\t\t\t\t<img class=\"record-person-avatar\" [src]=\"row.person.imageUrl\" alt=\"\" />\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t<span>{{ row.person.name }}</span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('badge') {\n\t\t\t\t\t\t<ga-status-badge [value]=\"row.value\"></ga-status-badge>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('money') {\n\t\t\t\t\t\t<ga-income-amount [value]=\"row.value\" [rowData]=\"record\"></ga-income-amount>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('date') {\n\t\t\t\t\t\t{{ row.value | dateFormat }}\n\t\t\t\t\t}\n\t\t\t\t\t@case ('datetime') {\n\t\t\t\t\t\t{{ row.value | dateTimeFormat }}\n\t\t\t\t\t}\n\t\t\t\t\t@case ('boolean') {\n\t\t\t\t\t\t{{ (row.value ? 'BUTTONS.YES' : 'BUTTONS.NO') | translate }}\n\t\t\t\t\t}\n\t\t\t\t\t@case ('email') {\n\t\t\t\t\t\t<a class=\"record-link\" [href]=\"'mailto:' + row.value\">{{ row.value }}</a>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('phone') {\n\t\t\t\t\t\t<a class=\"record-link\" [href]=\"'tel:' + row.value\">{{ row.value }}</a>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('link') {\n\t\t\t\t\t\t<a\n\t\t\t\t\t\t\tclass=\"record-link\"\n\t\t\t\t\t\t\t[href]=\"row.field.href || row.value\"\n\t\t\t\t\t\t\ttarget=\"_blank\"\n\t\t\t\t\t\t\trel=\"noopener noreferrer\"\n\t\t\t\t\t\t\t>{{ row.value }}</a\n\t\t\t\t\t\t>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('html') {\n\t\t\t\t\t\t<div class=\"record-rich\" [innerHTML]=\"row.value\"></div>\n\t\t\t\t\t}\n\t\t\t\t\t@case ('multiline') {\n\t\t\t\t\t\t<div class=\"record-multiline\">{{ row.value }}</div>\n\t\t\t\t\t}\n\t\t\t\t\t@default {\n\t\t\t\t\t\t{{ row.value }}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t</dd>\n\t</div>\n</ng-template>\n", styles: [":host{display:block;color:var(--text-basic-color)}.record-section+.record-section{margin-top:1.25rem}.record-section-title{margin:0 0 .5rem;font-size:.75rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--text-hint-color)}.record-rows{margin:0}.record-row{display:grid;grid-template-columns:minmax(6.5rem,38%) 1fr;gap:.5rem .75rem;align-items:baseline;padding:.375rem 0;border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.record-row:last-child{border-bottom:none}.record-row.wide{grid-template-columns:1fr;gap:.25rem}.record-label{margin:0;font-size:.75rem;font-weight:500;line-height:1.25rem;color:var(--text-hint-color)}.record-value{margin:0;font-size:.8125rem;line-height:1.25rem;min-width:0;overflow-wrap:anywhere}.record-empty{color:var(--text-disabled-color)}.record-link{color:var(--text-primary-color);text-decoration:none}.record-link:hover{text-decoration:underline}.record-multiline{white-space:pre-wrap}.record-rich :last-child{margin-bottom:0}.record-person{display:inline-flex;align-items:center;gap:.375rem}.record-person-avatar{width:1.25rem;height:1.25rem;border-radius:50%;object-fit:cover}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { record: [{
                type: Input
            }], sections: [{
                type: Input
            }], placeholder: [{
                type: Input
            }] } });
//# sourceMappingURL=record-view.component.js.map