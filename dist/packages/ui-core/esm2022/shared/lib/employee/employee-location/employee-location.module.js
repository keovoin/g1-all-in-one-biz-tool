import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbActionsModule, NbButtonModule, NbCardModule, NbIconModule, NbSelectModule, NbInputModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { CandidateStore, EmployeeStore } from '@gauzy/ui-core/core';
import { LeafletMapModule, LocationFormModule } from '../../forms';
import { EmployeeLocationComponent } from './employee-location.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class EmployeeLocationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLocationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLocationModule, declarations: [EmployeeLocationComponent], imports: [FormsModule,
            ReactiveFormsModule,
            NbCardModule,
            NbButtonModule,
            NbInputModule,
            NbSelectModule,
            NbIconModule,
            NbActionsModule, i1.TranslateModule, LocationFormModule,
            LeafletMapModule], exports: [EmployeeLocationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLocationModule, providers: [CandidateStore, EmployeeStore], imports: [FormsModule,
            ReactiveFormsModule,
            NbCardModule,
            NbButtonModule,
            NbInputModule,
            NbSelectModule,
            NbIconModule,
            NbActionsModule,
            TranslateModule.forChild(),
            LocationFormModule,
            LeafletMapModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLocationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        FormsModule,
                        ReactiveFormsModule,
                        NbCardModule,
                        NbButtonModule,
                        NbInputModule,
                        NbSelectModule,
                        NbIconModule,
                        NbActionsModule,
                        TranslateModule.forChild(),
                        LocationFormModule,
                        LeafletMapModule
                    ],
                    exports: [EmployeeLocationComponent],
                    declarations: [EmployeeLocationComponent],
                    providers: [CandidateStore, EmployeeStore]
                }]
        }] });
//# sourceMappingURL=employee-location.module.js.map