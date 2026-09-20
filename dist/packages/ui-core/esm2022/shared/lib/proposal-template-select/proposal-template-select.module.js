import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ProposalTemplateSelectComponent } from './proposal-template-select/proposal-template-select.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ProposalTemplateSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateSelectModule, declarations: [ProposalTemplateSelectComponent], imports: [CommonModule, FormsModule, NbSelectModule, i1.TranslateModule], exports: [ProposalTemplateSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateSelectModule, imports: [CommonModule, FormsModule, NbSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, NbSelectModule, TranslateModule.forChild()],
                    declarations: [ProposalTemplateSelectComponent],
                    exports: [ProposalTemplateSelectComponent]
                }]
        }] });
//# sourceMappingURL=proposal-template-select.module.js.map