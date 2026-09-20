import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbIconModule, NbPopoverModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { TimezoneFilterComponent } from './timezone-filter.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TimezoneFilterModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimezoneFilterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TimezoneFilterModule, declarations: [TimezoneFilterComponent], imports: [CommonModule, NbButtonModule, NbIconModule, NbPopoverModule, i1.TranslateModule], exports: [TimezoneFilterComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimezoneFilterModule, imports: [CommonModule, NbButtonModule, NbIconModule, NbPopoverModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimezoneFilterModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbButtonModule, NbIconModule, NbPopoverModule, TranslateModule.forChild()],
                    declarations: [TimezoneFilterComponent],
                    exports: [TimezoneFilterComponent]
                }]
        }] });
//# sourceMappingURL=timezone-filter.module.js.map