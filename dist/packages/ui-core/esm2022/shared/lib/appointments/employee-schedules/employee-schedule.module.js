import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeScheduleComponent } from './employee-schedule.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class EmployeeScheduleModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeScheduleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EmployeeScheduleModule, declarations: [EmployeeScheduleComponent], imports: [NbButtonModule, NbCardModule, i1.TranslateModule], exports: [EmployeeScheduleComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeScheduleModule, imports: [NbButtonModule, NbCardModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeScheduleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NbButtonModule, NbCardModule, TranslateModule.forChild()],
                    exports: [EmployeeScheduleComponent],
                    declarations: [EmployeeScheduleComponent]
                }]
        }] });
//# sourceMappingURL=employee-schedule.module.js.map