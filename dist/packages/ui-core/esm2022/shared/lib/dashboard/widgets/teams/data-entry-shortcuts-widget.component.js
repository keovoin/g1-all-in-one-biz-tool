import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionsEnum } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { BaseDashboardWidgetComponent } from '../../widget-host/base-dashboard-widget.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
/**
 * Quick links that jump straight into the "add income" / "add expense" flows.
 *
 * This wraps `ga-data-entry-shortcuts` as a widget — a component that was
 * written but never declared in ANY NgModule, so it could not be rendered at
 * all. Wrapping it fixes four things beyond making it reachable:
 *
 * 1. Its header was the untranslated literal "Data Entry Shortcuts". On a canvas
 *    the title belongs to `ga-dashboard-widget-host`, which translates it.
 * 2. Its two recurring-expense tiles shared one label
 *    (`DASHBOARD_PAGE.RECURRING_EXPENSES`), so they were indistinguishable; they
 *    now say Organization / Employee, and they open the recurring-expense pages
 *    with the create dialog rather than dropping the user on the generic
 *    organizations / employees list the original navigated to.
 * 3. The tiles were `<nb-card (click)>` — not focusable, not keyboard operable,
 *    and invisible to a screen reader. They are `<button>`s now.
 * 4. A user with none of the four permissions got an empty card; there is an
 *    explicit empty state.
 *
 * It fetches nothing, so it opts out of the base class' context-driven refresh.
 */
export class DataEntryShortcutsWidgetComponent extends BaseDashboardWidgetComponent {
    constructor() {
        super();
        this._router = inject(Router);
        this._store = inject(Store);
        /** Pure navigation: nothing to fetch, so the ambient context is irrelevant. */
        this.refreshOnContextChange = false;
        /** Bumped whenever role permissions change (sign-in, tenant switch, role edit). */
        this.permissionsVersion = signal(0, ...(ngDevMode ? [{ debugName: "permissionsVersion" }] : []));
        /** Tiles the current user is allowed to use. */
        this.shortcuts = computed(() => {
            // Read so the list is re-evaluated when the permission set arrives.
            this.permissionsVersion();
            const shortcuts = [];
            // Both halves are required on purpose: VIEW alone lets a user open the
            // page, but these tiles open the CREATE dialog straight away.
            const canAddIncome = this._store.hasPermission(PermissionsEnum.ORG_INCOMES_VIEW) &&
                this._store.hasPermission(PermissionsEnum.ORG_INCOMES_EDIT);
            const canAddExpense = this._store.hasPermission(PermissionsEnum.ORG_EXPENSES_VIEW) &&
                this._store.hasPermission(PermissionsEnum.ORG_EXPENSES_EDIT);
            // The EMPLOYEE recurring expenses page is gated by its OWN permission pair
            // in the sidebar (`employees-recurring-expenses`), not by the organization
            // expense one — offering the tile on `ORG_EXPENSES_*` would advertise a
            // page the route guard then refuses.
            const canAddEmployeeRecurringExpense = this._store.hasPermission(PermissionsEnum.EMPLOYEE_EXPENSES_VIEW) &&
                this._store.hasPermission(PermissionsEnum.EMPLOYEE_EXPENSES_EDIT);
            if (canAddIncome) {
                shortcuts.push({
                    id: 'income',
                    titleKey: 'MENU.INCOME',
                    descriptionKey: 'DASHBOARD_PAGE.ADD_INCOME',
                    icon: 'plus-circle-outline',
                    status: 'success',
                    route: 'pages/accounting/income?openAddDialog=true'
                });
            }
            if (canAddExpense) {
                shortcuts.push({
                    id: 'expense',
                    titleKey: 'MENU.EXPENSES',
                    descriptionKey: 'DASHBOARD_PAGE.ADD_EXPENSE',
                    icon: 'minus-circle-outline',
                    status: 'danger',
                    route: 'pages/accounting/expenses?openAddDialog=true'
                }, {
                    id: 'organization-recurring-expense',
                    titleKey: 'DASHBOARD_PAGE.BUILDER.WIDGETS.DATA_ENTRY_SHORTCUTS.ORGANIZATION_RECURRING',
                    descriptionKey: 'DASHBOARD_PAGE.ADD_ORGANIZATION_RECURRING_EXPENSE',
                    icon: 'minus-circle-outline',
                    status: 'danger',
                    // Same target the sidebar's "Expense Recurring" add-link uses. The
                    // original component navigated to `pages/organizations`, i.e. the
                    // org list — the advertised entry flow never opened.
                    route: 'pages/accounting/expense-recurring?openAddDialog=true'
                });
            }
            if (canAddEmployeeRecurringExpense) {
                shortcuts.push({
                    id: 'employee-recurring-expense',
                    titleKey: 'DASHBOARD_PAGE.BUILDER.WIDGETS.DATA_ENTRY_SHORTCUTS.EMPLOYEE_RECURRING',
                    descriptionKey: 'DASHBOARD_PAGE.ADD_EMPLOYEE_RECURRING_EXPENSE',
                    icon: 'minus-circle-outline',
                    status: 'danger',
                    // Same target the sidebar's "Recurring Expenses" add-link uses; the
                    // original navigated to the employee LIST instead.
                    route: 'pages/employees/recurring-expenses?openAddDialog=true'
                });
            }
            return shortcuts;
        }, ...(ngDevMode ? [{ debugName: "shortcuts" }] : []));
        // Permissions arrive asynchronously after sign-in and change on a tenant
        // switch; without this the widget would keep the very first evaluation.
        this._store.userRolePermissions$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.permissionsVersion.update((version) => version + 1));
    }
    /**
     * Opens the page behind a shortcut.
     *
     * @param shortcut - The activated tile.
     */
    open(shortcut) {
        // Failures are swallowed on purpose: a rejected navigation (a guard said
        // no) is not a data error, and turning it into the widget's error state
        // would hide every other shortcut behind a retry button. `false` rather
        // than `undefined` so the handler matches `navigateByUrl`'s own
        // `Promise<boolean>` instead of widening it to `any`.
        void this._router.navigateByUrl(shortcut.route).catch(() => false);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DataEntryShortcutsWidgetComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: DataEntryShortcutsWidgetComponent, isStandalone: true, selector: "ga-data-entry-shortcuts-widget", usesInheritance: true, ngImport: i0, template: "@if (shortcuts().length) {\n\t<div class=\"shortcut-grid\">\n\t\t@for (shortcut of shortcuts(); track shortcut.id) {\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"shortcut-tile\"\n\t\t\t\t[class.shortcut-tile--success]=\"shortcut.status === 'success'\"\n\t\t\t\t[class.shortcut-tile--danger]=\"shortcut.status === 'danger'\"\n\t\t\t\t(click)=\"open(shortcut)\"\n\t\t\t>\n\t\t\t\t<span class=\"shortcut-heading\">\n\t\t\t\t\t<nb-icon [icon]=\"shortcut.icon\"></nb-icon>\n\t\t\t\t\t<span class=\"shortcut-title\">{{ shortcut.titleKey | translate }}</span>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"shortcut-description\">{{ shortcut.descriptionKey | translate }}</span>\n\t\t\t</button>\n\t\t}\n\t</div>\n} @else {\n\t<div class=\"shortcut-empty\">\n\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t<span>{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.DATA_ENTRY_SHORTCUTS.NO_ACCESS' | translate }}</span>\n\t</div>\n}\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}.shortcut-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:.75rem;height:100%;overflow-y:auto;padding-right:.25rem}.shortcut-tile{display:flex;flex-direction:column;align-items:flex-start;gap:.5rem;padding:.875rem;min-width:0;text-align:start;cursor:pointer;border:1px solid var(--border-basic-color-3);border-inline-start-width:3px;border-radius:var(--border-radius);background-color:var(--background-basic-color-2);color:var(--text-basic-color);font-family:inherit;font-size:inherit;transition:box-shadow .15s ease-in-out,transform .15s ease-in-out}.shortcut-tile:hover{box-shadow:var(--shadow);transform:translateY(-1px)}.shortcut-tile:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:2px}.shortcut-tile--success{border-inline-start-color:var(--color-success-default)}.shortcut-tile--success nb-icon{color:var(--color-success-default)}.shortcut-tile--danger{border-inline-start-color:var(--color-danger-default)}.shortcut-tile--danger nb-icon{color:var(--color-danger-default)}@media(prefers-reduced-motion:reduce){.shortcut-tile{transition:none}.shortcut-tile:hover{transform:none}}.shortcut-heading{display:flex;align-items:center;gap:.375rem;min-width:0;font-weight:600}.shortcut-heading nb-icon{height:16px;width:16px;flex-shrink:0}.shortcut-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.shortcut-description{color:var(--text-hint-color);font-size:var(--text-caption-font-size)}.shortcut-empty{display:flex;align-items:center;justify-content:center;gap:.5rem;height:100%;padding:1rem;text-align:center;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}.shortcut-empty nb-icon{height:16px;width:16px;flex-shrink:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DataEntryShortcutsWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-data-entry-shortcuts-widget', standalone: true, imports: [NbIconModule, TranslateModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (shortcuts().length) {\n\t<div class=\"shortcut-grid\">\n\t\t@for (shortcut of shortcuts(); track shortcut.id) {\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"shortcut-tile\"\n\t\t\t\t[class.shortcut-tile--success]=\"shortcut.status === 'success'\"\n\t\t\t\t[class.shortcut-tile--danger]=\"shortcut.status === 'danger'\"\n\t\t\t\t(click)=\"open(shortcut)\"\n\t\t\t>\n\t\t\t\t<span class=\"shortcut-heading\">\n\t\t\t\t\t<nb-icon [icon]=\"shortcut.icon\"></nb-icon>\n\t\t\t\t\t<span class=\"shortcut-title\">{{ shortcut.titleKey | translate }}</span>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"shortcut-description\">{{ shortcut.descriptionKey | translate }}</span>\n\t\t\t</button>\n\t\t}\n\t</div>\n} @else {\n\t<div class=\"shortcut-empty\">\n\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t<span>{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.DATA_ENTRY_SHORTCUTS.NO_ACCESS' | translate }}</span>\n\t</div>\n}\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}.shortcut-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:.75rem;height:100%;overflow-y:auto;padding-right:.25rem}.shortcut-tile{display:flex;flex-direction:column;align-items:flex-start;gap:.5rem;padding:.875rem;min-width:0;text-align:start;cursor:pointer;border:1px solid var(--border-basic-color-3);border-inline-start-width:3px;border-radius:var(--border-radius);background-color:var(--background-basic-color-2);color:var(--text-basic-color);font-family:inherit;font-size:inherit;transition:box-shadow .15s ease-in-out,transform .15s ease-in-out}.shortcut-tile:hover{box-shadow:var(--shadow);transform:translateY(-1px)}.shortcut-tile:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:2px}.shortcut-tile--success{border-inline-start-color:var(--color-success-default)}.shortcut-tile--success nb-icon{color:var(--color-success-default)}.shortcut-tile--danger{border-inline-start-color:var(--color-danger-default)}.shortcut-tile--danger nb-icon{color:var(--color-danger-default)}@media(prefers-reduced-motion:reduce){.shortcut-tile{transition:none}.shortcut-tile:hover{transform:none}}.shortcut-heading{display:flex;align-items:center;gap:.375rem;min-width:0;font-weight:600}.shortcut-heading nb-icon{height:16px;width:16px;flex-shrink:0}.shortcut-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.shortcut-description{color:var(--text-hint-color);font-size:var(--text-caption-font-size)}.shortcut-empty{display:flex;align-items:center;justify-content:center;gap:.5rem;height:100%;padding:1rem;text-align:center;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}.shortcut-empty nb-icon{height:16px;width:16px;flex-shrink:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data-entry-shortcuts-widget.component.js.map