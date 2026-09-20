import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbIconModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutSelectorComponent } from './layout-selector.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class LayoutSelectorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LayoutSelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: LayoutSelectorModule, declarations: [LayoutSelectorComponent], imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbIconModule,
            NbSelectModule,
            NbTooltipModule, i1.TranslateModule], exports: [LayoutSelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LayoutSelectorModule, imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbIconModule,
            NbSelectModule,
            NbTooltipModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LayoutSelectorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbButtonModule,
                        NbIconModule,
                        NbSelectModule,
                        NbTooltipModule,
                        TranslateModule.forChild()
                    ],
                    exports: [LayoutSelectorComponent],
                    declarations: [LayoutSelectorComponent],
                    providers: []
                }]
        }] });
//# sourceMappingURL=layout-selector.module.js.map