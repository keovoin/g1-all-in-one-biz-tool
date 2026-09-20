import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { Store, monthNames } from '@gauzy/ui-core/core';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@nebular/theme";
import * as i4 from "@angular/common";
import * as i5 from "../../pipes/currency-position.pipe";
let RecurringExpenseHistoryComponent = class RecurringExpenseHistoryComponent extends TranslationBaseComponent {
    constructor(translateService, store) {
        super(translateService);
        this.translateService = translateService;
        this.store = store;
        this.recordsData = [];
        this.closeHistory = new EventEmitter();
        this.emitClose = () => {
            this.closeHistory.emit();
        };
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(debounceTime(100), distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), untilDestroyed(this))
            .subscribe();
    }
    getMonthString(month) {
        return monthNames[month];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseHistoryComponent, deps: [{ token: i1.TranslateService }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: RecurringExpenseHistoryComponent, isStandalone: false, selector: "ga-recurring-expense-history", inputs: { recordsData: "recordsData" }, outputs: { closeHistory: "closeHistory" }, usesInheritance: true, ngImport: i0, template: "<div class=\"recurring-expense-history\">\n  <div class=\"history\">\n    <h6>{{ 'POP_UPS.EXPENSE_HISTORY' | translate }}</h6>\n    <div class=\"row head\">\n      <div class=\"col\">\n        <b>{{ 'POP_UPS.STARTS_ON' | translate }}</b>\n      </div>\n      <div class=\"col\">\n        <b>{{ 'POP_UPS.NEW_EXPENSE_VALUE' | translate }}</b>\n      </div>\n    </div>\n    @for (record of recordsData; track record) {\n      <div class=\"row\">\n        <div class=\"col\">\n          {{ getMonthString(record.startMonth) }} {{ record.startYear }}\n        </div>\n        <div class=\"col\">\n          {{\n          record?.value\n          | currency: record?.currency\n          | position: organization?.currencyPosition\n          }}\n        </div>\n        <hr />\n      </div>\n    }\n  </div>\n  <div class=\"close-icon\" (click)=\"emitClose()\">\n    <nb-icon icon=\"close-outline\"></nb-icon>\n  </div>\n</div>\n", styles: [".recurring-expense-history{background-color:transparent;padding:10px 30px 0;border-radius:0 0 var(--border-radius) var(--border-radius);display:flex;flex-direction:row;justify-content:space-between}.recurring-expense-history .history{max-width:560px;flex:1}.recurring-expense-history .history .row.head b{font-weight:600;color:var(--gauzy-text-color-2, rgb(126, 126, 143))}.recurring-expense-history .history .row hr{flex:0 0 100%;margin:.5rem 0 0;border-top-color:var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.recurring-expense-history .history h6{font-size:16px;font-weight:600;line-height:17px;letter-spacing:0em;text-align:left;color:var(--gauzy-text-color-1, var(--text-basic-color))}.recurring-expense-history .close-icon{cursor:pointer;justify-content:space-between}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i4.CurrencyPipe, name: "currency" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }, { kind: "pipe", type: i5.CurrencyPositionPipe, name: "position" }] }); }
};
RecurringExpenseHistoryComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService, Store])
], RecurringExpenseHistoryComponent);
export { RecurringExpenseHistoryComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseHistoryComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-recurring-expense-history', standalone: false, template: "<div class=\"recurring-expense-history\">\n  <div class=\"history\">\n    <h6>{{ 'POP_UPS.EXPENSE_HISTORY' | translate }}</h6>\n    <div class=\"row head\">\n      <div class=\"col\">\n        <b>{{ 'POP_UPS.STARTS_ON' | translate }}</b>\n      </div>\n      <div class=\"col\">\n        <b>{{ 'POP_UPS.NEW_EXPENSE_VALUE' | translate }}</b>\n      </div>\n    </div>\n    @for (record of recordsData; track record) {\n      <div class=\"row\">\n        <div class=\"col\">\n          {{ getMonthString(record.startMonth) }} {{ record.startYear }}\n        </div>\n        <div class=\"col\">\n          {{\n          record?.value\n          | currency: record?.currency\n          | position: organization?.currencyPosition\n          }}\n        </div>\n        <hr />\n      </div>\n    }\n  </div>\n  <div class=\"close-icon\" (click)=\"emitClose()\">\n    <nb-icon icon=\"close-outline\"></nb-icon>\n  </div>\n</div>\n", styles: [".recurring-expense-history{background-color:transparent;padding:10px 30px 0;border-radius:0 0 var(--border-radius) var(--border-radius);display:flex;flex-direction:row;justify-content:space-between}.recurring-expense-history .history{max-width:560px;flex:1}.recurring-expense-history .history .row.head b{font-weight:600;color:var(--gauzy-text-color-2, rgb(126, 126, 143))}.recurring-expense-history .history .row hr{flex:0 0 100%;margin:.5rem 0 0;border-top-color:var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.recurring-expense-history .history h6{font-size:16px;font-weight:600;line-height:17px;letter-spacing:0em;text-align:left;color:var(--gauzy-text-color-1, var(--text-basic-color))}.recurring-expense-history .close-icon{cursor:pointer;justify-content:space-between}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Store }], propDecorators: { recordsData: [{
                type: Input
            }], closeHistory: [{
                type: Output
            }] } });
//# sourceMappingURL=recurring-expense-history.component.js.map