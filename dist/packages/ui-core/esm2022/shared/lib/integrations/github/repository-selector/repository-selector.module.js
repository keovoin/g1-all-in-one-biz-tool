import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { RepositorySelectorComponent } from './repository-selector.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class RepositorySelectorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RepositorySelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: RepositorySelectorModule, declarations: [RepositorySelectorComponent], imports: [CommonModule, FormsModule, i1.TranslateModule, NgSelectModule], exports: [RepositorySelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RepositorySelectorModule, imports: [CommonModule, FormsModule, TranslateModule.forChild(), NgSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RepositorySelectorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [RepositorySelectorComponent],
                    exports: [RepositorySelectorComponent],
                    imports: [CommonModule, FormsModule, TranslateModule.forChild(), NgSelectModule]
                }]
        }] });
//# sourceMappingURL=repository-selector.module.js.map