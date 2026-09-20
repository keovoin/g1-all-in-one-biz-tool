import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbContextMenuModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { WorkspacesComponent } from './workspaces.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class WorkspacesModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspacesModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: WorkspacesModule, declarations: [WorkspacesComponent], imports: [CommonModule, i1.TranslateModule, NbButtonModule,
            NbContextMenuModule,
            NbIconModule,
            NbSpinnerModule], exports: [WorkspacesComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspacesModule, imports: [CommonModule,
            TranslateModule.forChild(),
            NbButtonModule,
            NbContextMenuModule,
            NbIconModule,
            NbSpinnerModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspacesModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        TranslateModule.forChild(),
                        NbButtonModule,
                        NbContextMenuModule,
                        NbIconModule,
                        NbSpinnerModule
                    ],
                    declarations: [WorkspacesComponent],
                    exports: [WorkspacesComponent]
                }]
        }] });
//# sourceMappingURL=workspaces.module.js.map