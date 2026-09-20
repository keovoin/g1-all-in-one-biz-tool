import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { NbCardModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { LeafletMapComponent } from './leaflet.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class LeafletMapModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LeafletMapModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: LeafletMapModule, declarations: [LeafletMapComponent], imports: [CommonModule, NbCardModule, i1.TranslateModule, LeafletModule], exports: [LeafletMapComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LeafletMapModule, imports: [CommonModule, NbCardModule, TranslateModule.forChild(), LeafletModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LeafletMapModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [LeafletMapComponent],
                    exports: [LeafletMapComponent],
                    imports: [CommonModule, NbCardModule, TranslateModule.forChild(), LeafletModule]
                }]
        }] });
//# sourceMappingURL=leaflet.module.js.map