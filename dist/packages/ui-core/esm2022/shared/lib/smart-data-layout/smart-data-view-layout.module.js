import { NgModule } from '@angular/core';
import { NbIconModule, NbSelectModule, NbToggleModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { Angular2SmartTableModule } from 'angular2-smart-table';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from '../shared.module';
import { GauzyButtonActionModule } from '../gauzy-button-action/gauzy-button-action.module';
import { NoDataMessageModule } from './no-data-message/no-data-message.module';
import { PaginationComponent } from './pagination/pagination.component';
import { PaginationV2Component } from './pagination/pagination-v2/pagination-v2.component';
import { SmartTableSettlingDirective } from './smart-table-loading/smart-table-settling.directive';
import { SmartTableFilterToggleDirective } from './smart-table-filters/smart-table-filter-toggle.directive';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "ngx-permissions";
// Components
const COMPONENTS = [PaginationComponent, PaginationV2Component];
// Attach by element selector to every `angular2-smart-table` in scope, so the
// "still loading, not empty" fix and the collapsed-filters toggle land on every
// grid without a template change.
const DIRECTIVES = [SmartTableSettlingDirective, SmartTableFilterToggleDirective];
export class SmartDataViewLayoutModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SmartDataViewLayoutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: SmartDataViewLayoutModule, declarations: [PaginationComponent, PaginationV2Component, SmartTableSettlingDirective, SmartTableFilterToggleDirective], imports: [NbToggleModule,
            NbIconModule,
            NbSelectModule, i1.TranslateModule, i2.NgxPermissionsModule, Angular2SmartTableModule,
            SharedModule,
            GauzyButtonActionModule,
            NoDataMessageModule], exports: [Angular2SmartTableModule, GauzyButtonActionModule, NoDataMessageModule, PaginationComponent, PaginationV2Component, SmartTableSettlingDirective, SmartTableFilterToggleDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SmartDataViewLayoutModule, imports: [NbToggleModule,
            NbIconModule,
            NbSelectModule,
            TranslateModule.forChild(),
            NgxPermissionsModule.forChild(),
            Angular2SmartTableModule,
            SharedModule,
            GauzyButtonActionModule,
            NoDataMessageModule, Angular2SmartTableModule, GauzyButtonActionModule, NoDataMessageModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SmartDataViewLayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [...COMPONENTS, ...DIRECTIVES],
                    imports: [
                        NbToggleModule,
                        NbIconModule,
                        NbSelectModule,
                        TranslateModule.forChild(),
                        NgxPermissionsModule.forChild(),
                        Angular2SmartTableModule,
                        SharedModule,
                        GauzyButtonActionModule,
                        NoDataMessageModule
                    ],
                    exports: [Angular2SmartTableModule, GauzyButtonActionModule, NoDataMessageModule, ...COMPONENTS, ...DIRECTIVES],
                    providers: []
                }]
        }] });
//# sourceMappingURL=smart-data-view-layout.module.js.map