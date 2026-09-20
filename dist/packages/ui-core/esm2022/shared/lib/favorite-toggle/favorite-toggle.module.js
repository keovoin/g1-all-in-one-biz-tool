import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { FavoriteToggleComponent } from './favorite-toggle.component';
import * as i0 from "@angular/core";
export class FavoriteToggleModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FavoriteToggleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: FavoriteToggleModule, declarations: [FavoriteToggleComponent], imports: [CommonModule,
            NbButtonModule,
            NbIconModule,
            NbTooltipModule,
            TranslateModule], exports: [FavoriteToggleComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FavoriteToggleModule, imports: [CommonModule,
            NbButtonModule,
            NbIconModule,
            NbTooltipModule,
            TranslateModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FavoriteToggleModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [FavoriteToggleComponent],
                    imports: [
                        CommonModule,
                        NbButtonModule,
                        NbIconModule,
                        NbTooltipModule,
                        TranslateModule
                    ],
                    exports: [FavoriteToggleComponent]
                }]
        }] });
//# sourceMappingURL=favorite-toggle.module.js.map