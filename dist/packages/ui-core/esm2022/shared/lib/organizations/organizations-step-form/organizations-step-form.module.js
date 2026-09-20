import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbIconModule, NbInputModule, NbDatepickerModule, NbSelectModule, NbToastrModule, NbListModule, NbStepperModule, NbToggleModule, NbTooltipModule, NbSpinnerModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationDepartmentsService } from '@gauzy/ui-core/core';
import { OrganizationsStepFormComponent } from './organizations-step-form.component';
import { ImageUploaderModule } from '../../image-uploader/image-uploader.module';
import { RemoveLodashModule } from '../../remove-lodash/remove-lodash.module';
import { TagsColorInputModule } from '../../tags/tags-color-input/tags-color-input.module';
import { LeafletMapModule, LocationFormModule } from '../../forms';
import { CurrencyModule } from '../../modules/currency';
import { CountryModule } from '../../modules/country';
import { TimeZoneSelectorModule } from '../../modules/selectors';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class OrganizationsStepFormModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationsStepFormModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: OrganizationsStepFormModule, declarations: [OrganizationsStepFormComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            NgSelectModule,
            NbInputModule,
            NbDatepickerModule,
            ImageUploaderModule,
            NbSelectModule, i1.NbToastrModule, NbListModule,
            NbStepperModule,
            NbToggleModule,
            NbSpinnerModule,
            RemoveLodashModule,
            NbTooltipModule, i2.TranslateModule, TagsColorInputModule,
            CurrencyModule,
            CountryModule,
            LocationFormModule,
            LeafletMapModule,
            TimeZoneSelectorModule], exports: [OrganizationsStepFormComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationsStepFormModule, providers: [OrganizationDepartmentsService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            NgSelectModule,
            NbInputModule,
            NbDatepickerModule,
            ImageUploaderModule,
            NbSelectModule,
            NbToastrModule.forRoot(),
            NbListModule,
            NbStepperModule,
            NbToggleModule,
            NbSpinnerModule,
            RemoveLodashModule,
            NbTooltipModule,
            TranslateModule.forChild(),
            TagsColorInputModule,
            CurrencyModule,
            CountryModule,
            LocationFormModule,
            LeafletMapModule,
            TimeZoneSelectorModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationsStepFormModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbCardModule,
                        NbButtonModule,
                        NbIconModule,
                        NgSelectModule,
                        NbInputModule,
                        NbDatepickerModule,
                        ImageUploaderModule,
                        NbSelectModule,
                        NbToastrModule.forRoot(),
                        NbListModule,
                        NbStepperModule,
                        NbToggleModule,
                        NbSpinnerModule,
                        RemoveLodashModule,
                        NbTooltipModule,
                        TranslateModule.forChild(),
                        TagsColorInputModule,
                        CurrencyModule,
                        CountryModule,
                        LocationFormModule,
                        LeafletMapModule,
                        TimeZoneSelectorModule
                    ],
                    declarations: [OrganizationsStepFormComponent],
                    providers: [OrganizationDepartmentsService],
                    exports: [OrganizationsStepFormComponent]
                }]
        }] });
//# sourceMappingURL=organizations-step-form.module.js.map