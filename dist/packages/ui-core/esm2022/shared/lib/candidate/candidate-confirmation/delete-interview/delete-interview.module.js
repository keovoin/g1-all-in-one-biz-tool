import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbButtonModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteInterviewComponent } from './delete-interview.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class DeleteInterviewModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DeleteInterviewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DeleteInterviewModule, declarations: [DeleteInterviewComponent], imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, i1.TranslateModule], exports: [DeleteInterviewComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DeleteInterviewModule, imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DeleteInterviewModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, TranslateModule.forChild()],
                    declarations: [DeleteInterviewComponent],
                    exports: [DeleteInterviewComponent]
                }]
        }] });
//# sourceMappingURL=delete-interview.module.js.map