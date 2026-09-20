import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { FileProviderSelectorComponent } from './file-provider-selector.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class FileProviderSelectorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileProviderSelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: FileProviderSelectorModule, declarations: [FileProviderSelectorComponent], imports: [CommonModule, FormsModule, NbSelectModule, i1.TranslateModule], exports: [FileProviderSelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileProviderSelectorModule, imports: [CommonModule, FormsModule, NbSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileProviderSelectorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, NbSelectModule, TranslateModule.forChild()],
                    declarations: [FileProviderSelectorComponent],
                    exports: [FileProviderSelectorComponent]
                }]
        }] });
//# sourceMappingURL=file-provider-selector.module.js.map