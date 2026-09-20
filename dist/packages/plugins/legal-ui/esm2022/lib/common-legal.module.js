import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class CommonLegalModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CommonLegalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CommonLegalModule, declarations: [TermsAndConditionsComponent, PrivacyPolicyComponent], imports: [CommonModule, i1.TranslateModule], exports: [TermsAndConditionsComponent, PrivacyPolicyComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CommonLegalModule, imports: [CommonModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CommonLegalModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, TranslateModule.forChild()],
                    declarations: [TermsAndConditionsComponent, PrivacyPolicyComponent],
                    exports: [TermsAndConditionsComponent, PrivacyPolicyComponent]
                }]
        }] });
//# sourceMappingURL=common-legal.module.js.map