import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { ProjectColumnViewComponent } from './project-column-view.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ProjectColumnViewModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectColumnViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ProjectColumnViewModule, declarations: [ProjectColumnViewComponent], imports: [CommonModule, i1.TranslateModule, SharedModule], exports: [ProjectColumnViewComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectColumnViewModule, imports: [CommonModule, TranslateModule.forChild(), SharedModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectColumnViewModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, TranslateModule.forChild(), SharedModule],
                    declarations: [ProjectColumnViewComponent],
                    exports: [ProjectColumnViewComponent]
                }]
        }] });
//# sourceMappingURL=project-column-view.module.js.map