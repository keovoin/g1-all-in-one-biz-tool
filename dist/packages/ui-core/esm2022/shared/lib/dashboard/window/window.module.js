import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbIconModule, NbPopoverModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { WindowComponent } from '../window/window.component';
import { WindowTemplateDirective } from './window-template.directive';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class WindowModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: WindowModule, declarations: [WindowComponent], imports: [CommonModule,
            NbButtonModule,
            NbIconModule,
            NbPopoverModule, i1.TranslateModule, SharedModule,
            WindowTemplateDirective], exports: [WindowComponent, WindowTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowModule, imports: [CommonModule,
            NbButtonModule,
            NbIconModule,
            NbPopoverModule,
            TranslateModule.forChild(),
            SharedModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbButtonModule,
                        NbIconModule,
                        NbPopoverModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        WindowTemplateDirective
                    ],
                    declarations: [WindowComponent],
                    exports: [WindowComponent, WindowTemplateDirective]
                }]
        }] });
//# sourceMappingURL=window.module.js.map