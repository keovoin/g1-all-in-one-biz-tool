import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { SmartDataViewLayoutModule } from '../../smart-data-layout';
import { ProjectModuleTableComponent } from './project-module-table.component';
import { ProjectModuleMutationModule } from '../project-module-mutation/project-module-mutation.module';
import { TranslateModule } from '@ngx-translate/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ProjectModuleTableModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectModuleTableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ProjectModuleTableModule, declarations: [ProjectModuleTableComponent], imports: [CommonModule,
            NbSpinnerModule,
            NbButtonModule,
            NbIconModule, i1.TranslateModule, ProjectModuleMutationModule,
            SmartDataViewLayoutModule], exports: [ProjectModuleTableComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectModuleTableModule, imports: [CommonModule,
            NbSpinnerModule,
            NbButtonModule,
            NbIconModule,
            TranslateModule.forChild(),
            ProjectModuleMutationModule,
            SmartDataViewLayoutModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectModuleTableModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ProjectModuleTableComponent],
                    exports: [ProjectModuleTableComponent],
                    imports: [
                        CommonModule,
                        NbSpinnerModule,
                        NbButtonModule,
                        NbIconModule,
                        TranslateModule.forChild(),
                        ProjectModuleMutationModule,
                        SmartDataViewLayoutModule
                    ]
                }]
        }] });
//# sourceMappingURL=project-module-table.module.js.map