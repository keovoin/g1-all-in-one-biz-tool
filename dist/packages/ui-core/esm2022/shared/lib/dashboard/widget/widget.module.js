import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbIconModule, NbPopoverModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { WidgetComponent } from './widget.component';
import { WidgetTemplateDirective } from './widget-template.directive';
import { SharedModule } from '../../shared.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class WidgetModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: WidgetModule, declarations: [WidgetComponent], imports: [CommonModule,
            NbButtonModule,
            NbIconModule,
            NbPopoverModule, i1.TranslateModule, SharedModule,
            WidgetTemplateDirective], exports: [WidgetComponent, WidgetTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetModule, imports: [CommonModule,
            NbButtonModule,
            NbIconModule,
            NbPopoverModule,
            TranslateModule.forChild(),
            SharedModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbButtonModule,
                        NbIconModule,
                        NbPopoverModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        WidgetTemplateDirective
                    ],
                    declarations: [WidgetComponent],
                    exports: [WidgetComponent, WidgetTemplateDirective]
                }]
        }] });
//# sourceMappingURL=widget.module.js.map