import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAutocompleteModule, NbCheckboxModule, NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared.module';
import { CandidateSelectComponent } from './candidate-select.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class CandidateSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CandidateSelectModule, declarations: [CandidateSelectComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbCheckboxModule,
            NbSelectModule,
            NbAutocompleteModule, i1.TranslateModule, SharedModule], exports: [CandidateSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateSelectModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbCheckboxModule,
            NbSelectModule,
            NbAutocompleteModule,
            TranslateModule.forChild(),
            SharedModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbCheckboxModule,
                        NbSelectModule,
                        NbAutocompleteModule,
                        TranslateModule.forChild(),
                        SharedModule
                    ],
                    declarations: [CandidateSelectComponent],
                    exports: [CandidateSelectComponent],
                    providers: []
                }]
        }] });
//# sourceMappingURL=candidate-select.module.js.map