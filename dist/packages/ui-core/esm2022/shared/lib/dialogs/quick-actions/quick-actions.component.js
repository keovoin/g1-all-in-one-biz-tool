import { Component, Input } from '@angular/core';
import { NbDialogRef, NbIconLibraries, NbMenuService } from '@nebular/theme';
import { TimeLogType } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { TimeTrackerService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "@gauzy/ui-core/core";
const quickActionsCollection = {
    accounting: [
        'QUICK_ACTIONS_MENU.CREATE_INVOICE',
        'QUICK_ACTIONS_MENU.VIEW_INVOICE',
        'QUICK_ACTIONS_MENU.RECEIVED_INVOICES',
        'QUICK_ACTIONS_MENU.CREATE_INCOME',
        'QUICK_ACTIONS_MENU.CREATE_EXPENSE',
        'QUICK_ACTIONS_MENU.CREATE_ESTIMATE',
        'QUICK_ACTIONS_MENU.RECEIVED_ESTIMATES',
        'QUICK_ACTIONS_MENU.CREATE_PAYMENT'
    ],
    organization: [
        'QUICK_ACTIONS_MENU.ADD_EMPLOYEE',
        'QUICK_ACTIONS_MENU.ADD_INVENTORY',
        'QUICK_ACTIONS_MENU.ADD_EQUIPMENT',
        'QUICK_ACTIONS_MENU.ADD_VENDOR',
        'QUICK_ACTIONS_MENU.ADD_DEPARTMENT'
    ],
    pm: [
        'QUICK_ACTIONS_MENU.CREATE_TEAM',
        'QUICK_ACTIONS_MENU.CREATE_TASK',
        'QUICK_ACTIONS_MENU.CREATE_PROJECT',
        'QUICK_ACTIONS_MENU.VIEW_TASKS',
        'QUICK_ACTIONS_MENU.VIEW_TEAM_TASKS'
    ],
    jobs: [
        'QUICK_ACTIONS_MENU.CREATE_CANDIDATE',
        'QUICK_ACTIONS_MENU.CREATE_PROPOSAL',
        'QUICK_ACTIONS_MENU.CREATE_CONTRACT'
    ],
    contacts: [
        'QUICK_ACTIONS_MENU.CREATE_LEAD',
        'QUICK_ACTIONS_MENU.CREATE_CUSTOMER',
        'QUICK_ACTIONS_MENU.CREATE_CLIENT',
        'QUICK_ACTIONS_MENU.VIEW_CLIENTS'
    ],
    time_tracking: [
        'QUICK_ACTIONS_MENU.START_TIMER',
        'QUICK_ACTIONS_MENU.STOP_TIMER',
        'QUICK_ACTIONS_MENU.TIME_LOG',
        'QUICK_ACTIONS_MENU.VIEW_APPOINTMENTS',
        'QUICK_ACTIONS_MENU.VIEW_TIME_ACTIVITY'
    ],
    // Documents hub (`@gauzy/plugin-docs-ui`, `01-ux-spec.md` §1). The labels live in
    // CORE i18n rather than the plugin's `DOCS` namespace on purpose: grouping matches
    // on the *translated* title, and the plugin merges its namespace on plugin bootstrap
    // — a menu built before that merge would group by the raw key and show it as the label.
    documents: ['QUICK_ACTIONS_MENU.DOCUMENTS.NEW_PAGE', 'QUICK_ACTIONS_MENU.DOCUMENTS.UPLOAD']
};
export class QuickActionsComponent extends TranslationBaseComponent {
    constructor(translate, dialogRef, nbMenuService, timeTrackerService, iconLibraries) {
        super(translate);
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.nbMenuService = nbMenuService;
        this.timeTrackerService = timeTrackerService;
        this.iconLibraries = iconLibraries;
        this.items = [];
        this.shortcutDialog = '';
        this.actions = {
            START_TIMER: 'START_TIMER',
            STOP_TIMER: 'STOP_TIMER'
        };
        this.iconLibraries.registerFontPack('font-awesome', {
            packClass: 'fas',
            iconClassPrefix: 'fa'
        });
    }
    ngOnInit() {
        this.groupedQuickActions = this._groupQuickActions(this.items);
        this.nbMenuService
            .onItemClick()
            .pipe()
            .subscribe(async (e) => {
            if (e.item.data?.action && !e.item.link) {
                switch (e.item.data.action) {
                    case this.actions.START_TIMER:
                        if (this.timeTrackerService.running)
                            return;
                        this.timeTrackerService.setTimeLogType(TimeLogType.TRACKED);
                        this.timeTrackerService.openAndStartTimer();
                        break;
                    case this.actions.STOP_TIMER:
                        if (this.timeTrackerService.running)
                            await this.timeTrackerService.toggle();
                        break;
                }
            }
            this.closeDialog();
        });
    }
    closeDialog() {
        this.dialogRef.close();
    }
    isBelongToGroup(groupName, title) {
        return quickActionsCollection[groupName].map((action) => this.getTranslation(action)).includes(title);
    }
    _groupQuickActions(items) {
        const groupedActions = {
            accounting: {
                groupTitle: 'QUICK_ACTIONS_GROUP.ACCOUNTING',
                items: []
            },
            time_tracking: {
                groupTitle: 'QUICK_ACTIONS_GROUP.TIME_TRACKING',
                items: []
            },
            jobs: {
                groupTitle: 'QUICK_ACTIONS_GROUP.JOBS',
                items: []
            },
            pm: {
                groupTitle: 'QUICK_ACTIONS_GROUP.PROJECT_MANAGEMENT',
                items: []
            },
            contacts: {
                groupTitle: 'QUICK_ACTIONS_GROUP.CONTACTS',
                items: []
            },
            organization: {
                groupTitle: 'QUICK_ACTIONS_GROUP.ORGANIZATION',
                items: []
            },
            documents: {
                groupTitle: 'QUICK_ACTIONS_GROUP.DOCUMENTS',
                items: []
            }
        };
        items.map((item) => {
            if (this.isBelongToGroup('accounting', item.title))
                groupedActions.accounting.items.push(item);
            if (this.isBelongToGroup('time_tracking', item.title)) {
                groupedActions.time_tracking.items.push({
                    ...item,
                    hidden: false
                });
            }
            if (this.isBelongToGroup('jobs', item.title))
                groupedActions.jobs.items.push(item);
            if (this.isBelongToGroup('pm', item.title))
                groupedActions.pm.items.push(item);
            if (this.isBelongToGroup('contacts', item.title))
                groupedActions.contacts.items.push(item);
            if (this.isBelongToGroup('organization', item.title))
                groupedActions.organization.items.push(item);
            if (this.isBelongToGroup('documents', item.title))
                groupedActions.documents.items.push(item);
            return item;
        });
        const finalData = Object.values(groupedActions).sort((a, b) => b.items?.length - a.items?.length);
        return finalData;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: QuickActionsComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i2.NbMenuService }, { token: i3.TimeTrackerService }, { token: i2.NbIconLibraries }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: QuickActionsComponent, isStandalone: false, selector: "ngx-quick-actions", inputs: { items: "items", shortcutDialog: "shortcutDialog" }, usesInheritance: true, ngImport: i0, template: "<nb-card>\n  <nb-card-header >\n    <div>\n      <h6>\n        {{ \"DIALOG.QUICK_ACTIONS\" | translate }}\n      </h6>\n      <nb-tag status=\"basic\" appearance=\"filled\" size=\"tiny\" [text]=\"shortcutDialog.split('+').join(' + ').toUpperCase()\"></nb-tag>\n    </div>\n    <span class=\"cancel\" (click)=\"closeDialog()\"><i class=\"fas fa-times\"></i></span>\n  </nb-card-header>\n  <nb-card-body >\n    @for (group of groupedQuickActions; track group) {\n      @if (group.items?.length) {\n        <div class=\"group-container\">\n          <div class=\"group-content\">\n            <p class=\"group-header\">{{ group.groupTitle | translate }}</p>\n            <nb-menu [items]=\"group.items\">\n            </nb-menu>\n          </div>\n        </div>\n      }\n    }\n  </nb-card-body>\n</nb-card>\n", styles: [":host nb-card-header{display:flex}[dir=rtl] :host nb-card-header{flex-direction:row-reverse}:host nb-card-header{flex-direction:row;justify-content:space-between}:host nb-card-header div{display:flex;justify-content:space-between;width:27%}[dir=rtl] :host nb-card-header div{flex-direction:row-reverse}:host nb-card-header div nb-tag{border:none}:host nb-card-header div nb-tag:hover{background-color:var(--tag-filled-basic-background-color)}:host nb-card-header span{cursor:pointer}:host nb-card-body{display:grid;grid-template-columns:repeat(3,1fr)}:host nb-card-body .group-container{background:var(--gauzy-card-2);padding:10px 20px;border-radius:var(--border-radius);margin:.5rem}:host nb-card-body .group-container .group-header{font-weight:700;font-size:1rem;color:var(--gauzy-text-color-2);margin-top:.5rem}:host nb-menu ::ng-deep ul.menu-items li.menu-item a{padding-inline:2px}[dir=rtl] :host nb-menu ::ng-deep ul.menu-items li.menu-item a{flex-direction:row-reverse}:host nb-menu ::ng-deep ul.menu-items li.menu-item a{transition:all}:host nb-menu ::ng-deep ul.menu-items li.menu-item a .fas{font-size:1.1rem}:host nb-menu ::ng-deep ul.menu-items li.menu-item a:hover nb-badge{outline:1px solid var(--color-primary-400);color:var(--color-primary-400)}[dir=rtl] :host nb-menu ::ng-deep ul.menu-items li.menu-item a nb-icon{margin-left:.5rem}[dir=rtl] :host nb-menu ::ng-deep ul.menu-items li.menu-item a nb-icon{margin-right:0}:host nb-menu ::ng-deep ul.menu-items li.menu-item a nb-badge{margin-left:1rem}[dir=rtl] :host nb-menu ::ng-deep ul.menu-items li.menu-item a nb-badge{margin-right:1rem}[dir=rtl] :host nb-menu ::ng-deep ul.menu-items li.menu-item a nb-badge{margin-left:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbMenuComponent, selector: "nb-menu", inputs: ["tag", "items", "autoCollapse"] }, { kind: "component", type: i2.NbTagComponent, selector: "nb-tag", inputs: ["text", "selected", "removable", "appearance", "status", "size", "role"], outputs: ["remove", "selectedChange"], exportAs: ["nbTag"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: QuickActionsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-quick-actions', standalone: false, template: "<nb-card>\n  <nb-card-header >\n    <div>\n      <h6>\n        {{ \"DIALOG.QUICK_ACTIONS\" | translate }}\n      </h6>\n      <nb-tag status=\"basic\" appearance=\"filled\" size=\"tiny\" [text]=\"shortcutDialog.split('+').join(' + ').toUpperCase()\"></nb-tag>\n    </div>\n    <span class=\"cancel\" (click)=\"closeDialog()\"><i class=\"fas fa-times\"></i></span>\n  </nb-card-header>\n  <nb-card-body >\n    @for (group of groupedQuickActions; track group) {\n      @if (group.items?.length) {\n        <div class=\"group-container\">\n          <div class=\"group-content\">\n            <p class=\"group-header\">{{ group.groupTitle | translate }}</p>\n            <nb-menu [items]=\"group.items\">\n            </nb-menu>\n          </div>\n        </div>\n      }\n    }\n  </nb-card-body>\n</nb-card>\n", styles: [":host nb-card-header{display:flex}[dir=rtl] :host nb-card-header{flex-direction:row-reverse}:host nb-card-header{flex-direction:row;justify-content:space-between}:host nb-card-header div{display:flex;justify-content:space-between;width:27%}[dir=rtl] :host nb-card-header div{flex-direction:row-reverse}:host nb-card-header div nb-tag{border:none}:host nb-card-header div nb-tag:hover{background-color:var(--tag-filled-basic-background-color)}:host nb-card-header span{cursor:pointer}:host nb-card-body{display:grid;grid-template-columns:repeat(3,1fr)}:host nb-card-body .group-container{background:var(--gauzy-card-2);padding:10px 20px;border-radius:var(--border-radius);margin:.5rem}:host nb-card-body .group-container .group-header{font-weight:700;font-size:1rem;color:var(--gauzy-text-color-2);margin-top:.5rem}:host nb-menu ::ng-deep ul.menu-items li.menu-item a{padding-inline:2px}[dir=rtl] :host nb-menu ::ng-deep ul.menu-items li.menu-item a{flex-direction:row-reverse}:host nb-menu ::ng-deep ul.menu-items li.menu-item a{transition:all}:host nb-menu ::ng-deep ul.menu-items li.menu-item a .fas{font-size:1.1rem}:host nb-menu ::ng-deep ul.menu-items li.menu-item a:hover nb-badge{outline:1px solid var(--color-primary-400);color:var(--color-primary-400)}[dir=rtl] :host nb-menu ::ng-deep ul.menu-items li.menu-item a nb-icon{margin-left:.5rem}[dir=rtl] :host nb-menu ::ng-deep ul.menu-items li.menu-item a nb-icon{margin-right:0}:host nb-menu ::ng-deep ul.menu-items li.menu-item a nb-badge{margin-left:1rem}[dir=rtl] :host nb-menu ::ng-deep ul.menu-items li.menu-item a nb-badge{margin-right:1rem}[dir=rtl] :host nb-menu ::ng-deep ul.menu-items li.menu-item a nb-badge{margin-left:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i2.NbMenuService }, { type: i3.TimeTrackerService }, { type: i2.NbIconLibraries }], propDecorators: { items: [{
                type: Input
            }], shortcutDialog: [{
                type: Input
            }] } });
//# sourceMappingURL=quick-actions.component.js.map