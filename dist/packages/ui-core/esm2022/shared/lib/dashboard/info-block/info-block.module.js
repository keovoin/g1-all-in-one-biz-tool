import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAccordionModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { InfoBlockComponent } from './info-block.component';
import * as i0 from "@angular/core";
export class InfoBlockModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InfoBlockModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: InfoBlockModule, declarations: [InfoBlockComponent], imports: [CommonModule, NbAccordionModule, NbIconModule, NbTooltipModule], exports: [InfoBlockComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InfoBlockModule, imports: [CommonModule, NbAccordionModule, NbIconModule, NbTooltipModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InfoBlockModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbAccordionModule, NbIconModule, NbTooltipModule],
                    exports: [InfoBlockComponent],
                    declarations: [InfoBlockComponent],
                    providers: []
                }]
        }] });
//# sourceMappingURL=info-block.module.js.map