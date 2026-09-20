import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NbButtonModule, NbDialogModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { GalleryComponent } from './gallery.component';
import { GalleryDirective } from './gallery.directive';
import { SharedModule } from '../shared.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class GalleryModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GalleryModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: GalleryModule, declarations: [GalleryComponent], imports: [CommonModule,
            NbButtonModule,
            NbDialogModule,
            NbIconModule,
            NbTooltipModule,
            SharedModule, i1.TranslateModule, GalleryDirective], exports: [GalleryDirective, GalleryComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GalleryModule, imports: [CommonModule,
            NbButtonModule,
            NbDialogModule,
            NbIconModule,
            NbTooltipModule,
            SharedModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GalleryModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbButtonModule,
                        NbDialogModule,
                        NbIconModule,
                        NbTooltipModule,
                        SharedModule,
                        TranslateModule.forChild(),
                        GalleryDirective
                    ],
                    exports: [GalleryDirective, GalleryComponent],
                    declarations: [GalleryComponent]
                }]
        }] });
//# sourceMappingURL=gallery.module.js.map