import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbButtonModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteFeedbackComponent } from './delete-feedback.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class DeleteFeedbackModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DeleteFeedbackModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DeleteFeedbackModule, declarations: [DeleteFeedbackComponent], imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, i1.TranslateModule], exports: [DeleteFeedbackComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DeleteFeedbackModule, imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DeleteFeedbackModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, TranslateModule.forChild()],
                    declarations: [DeleteFeedbackComponent],
                    exports: [DeleteFeedbackComponent]
                }]
        }] });
//# sourceMappingURL=delete-feedback.module.js.map