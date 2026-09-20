import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbIconModule, NbButtonModule, NbCardModule } from '@nebular/theme';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CandidateCalendarInfoComponent } from './candidate-calendar-info.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class CandidateCalendarInfoModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateCalendarInfoModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CandidateCalendarInfoModule, declarations: [CandidateCalendarInfoComponent], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            FullCalendarModule, i1.TranslateModule], exports: [CandidateCalendarInfoComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateCalendarInfoModule, imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            FullCalendarModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateCalendarInfoModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbCardModule,
                        NbButtonModule,
                        NbIconModule,
                        FullCalendarModule,
                        TranslateModule.forChild()
                    ],
                    exports: [CandidateCalendarInfoComponent],
                    declarations: [CandidateCalendarInfoComponent]
                }]
        }] });
//# sourceMappingURL=candidate-calendar-info.module.js.map