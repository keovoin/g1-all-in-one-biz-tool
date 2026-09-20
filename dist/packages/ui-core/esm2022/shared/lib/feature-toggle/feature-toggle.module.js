import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbListModule, NbSpinnerModule, NbToggleModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { FeatureService, FeatureStoreService } from '@gauzy/ui-core/core';
import { CountdownConfirmationModule } from '../user/forms/countdown-confirmation/countdown-confirmation.module';
import { FeatureToggleComponent } from './feature-toggle.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class FeatureToggleModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureToggleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: FeatureToggleModule, declarations: [FeatureToggleComponent], imports: [CommonModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbIconModule,
            NbListModule,
            NbSpinnerModule,
            NbToggleModule, i1.TranslateModule, CountdownConfirmationModule], exports: [FeatureToggleComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureToggleModule, providers: [FeatureService, FeatureStoreService], imports: [CommonModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbIconModule,
            NbListModule,
            NbSpinnerModule,
            NbToggleModule,
            TranslateModule.forChild(),
            CountdownConfirmationModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureToggleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbButtonModule,
                        NbCardModule,
                        NbCheckboxModule,
                        NbIconModule,
                        NbListModule,
                        NbSpinnerModule,
                        NbToggleModule,
                        TranslateModule.forChild(),
                        CountdownConfirmationModule
                    ],
                    declarations: [FeatureToggleComponent],
                    exports: [FeatureToggleComponent],
                    providers: [FeatureService, FeatureStoreService]
                }]
        }] });
//# sourceMappingURL=feature-toggle.module.js.map