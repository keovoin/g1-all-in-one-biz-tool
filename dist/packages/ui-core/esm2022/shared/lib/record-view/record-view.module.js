import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../pipes/pipes.module';
import { StatusBadgeModule } from '../status-badge/status-badge.module';
import { TableComponentsModule } from '../table-components/table-components.module';
import { RecordViewComponent } from './record-view.component';
import { RecordViewDrawerComponent } from './record-view-drawer.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "ngx-permissions";
/**
 * The shared read-only "View" surface: a descriptor-driven record renderer plus
 * the right-side drawer that hosts it for the simpler records.
 *
 * `TableComponentsModule` is imported for the tag / people / team / amount
 * renderers — a record must read the same in its View as in the grid row it was
 * selected from.
 */
export class RecordViewModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: RecordViewModule, declarations: [RecordViewComponent, RecordViewDrawerComponent], imports: [CommonModule,
            NbButtonModule,
            NbIconModule,
            PipesModule,
            StatusBadgeModule,
            TableComponentsModule, i1.TranslateModule, i2.NgxPermissionsModule], exports: [RecordViewComponent, RecordViewDrawerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordViewModule, imports: [CommonModule,
            NbButtonModule,
            NbIconModule,
            PipesModule,
            StatusBadgeModule,
            TableComponentsModule,
            TranslateModule.forChild(),
            NgxPermissionsModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordViewModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbButtonModule,
                        NbIconModule,
                        PipesModule,
                        StatusBadgeModule,
                        TableComponentsModule,
                        TranslateModule.forChild(),
                        NgxPermissionsModule.forChild()
                    ],
                    declarations: [RecordViewComponent, RecordViewDrawerComponent],
                    exports: [RecordViewComponent, RecordViewDrawerComponent]
                }]
        }] });
//# sourceMappingURL=record-view.module.js.map