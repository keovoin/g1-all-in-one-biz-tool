import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCheckboxModule, NbFormFieldModule, NbIconModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { NgMapsGoogleModule } from '@ng-maps/google';
import { TranslateModule } from '@ngx-translate/core';
import { LocationFormComponent } from './location-form.component';
import { CountryModule } from '../../modules/country/country.module';
import { LeafletMapModule } from '../maps/leaflet/leaflet.module';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class LocationFormModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LocationFormModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: LocationFormModule, declarations: [LocationFormComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbSelectModule,
            NbInputModule,
            NbCheckboxModule,
            NbFormFieldModule,
            NbIconModule,
            NgMapsGoogleModule, i1.TranslateModule, CountryModule,
            LeafletMapModule], exports: [LocationFormComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LocationFormModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbSelectModule,
            NbInputModule,
            NbCheckboxModule,
            NbFormFieldModule,
            NbIconModule,
            NgMapsGoogleModule,
            TranslateModule.forChild(),
            CountryModule,
            LeafletMapModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LocationFormModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbSelectModule,
                        NbInputModule,
                        NbCheckboxModule,
                        NbFormFieldModule,
                        NbIconModule,
                        NgMapsGoogleModule,
                        TranslateModule.forChild(),
                        CountryModule,
                        LeafletMapModule
                    ],
                    exports: [LocationFormComponent],
                    declarations: [LocationFormComponent]
                }]
        }] });
//# sourceMappingURL=location-form.module.js.map