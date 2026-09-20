import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@gauzy/ui-core/core';
import { CardGridComponent } from './card-grid.component';
import { CustomViewComponent } from './card-grid-custom.component';
import { NoDataMessageModule } from '../smart-data-layout/no-data-message/no-data-message.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
// Standalone Modules
const STANDALONE_MODULES = [
    InfiniteScrollDirective // Standalone directive must be imported, not declared
];
export class CardGridModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CardGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CardGridModule, declarations: [CardGridComponent, CustomViewComponent], imports: [CommonModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule, InfiniteScrollDirective // Standalone directive must be imported, not declared
            , i1.TranslateModule, NoDataMessageModule], exports: [CardGridComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CardGridModule, providers: [Store], imports: [CommonModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            TranslateModule.forChild(),
            NoDataMessageModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CardGridModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbCardModule,
                        NbButtonModule,
                        NbIconModule,
                        ...STANDALONE_MODULES,
                        TranslateModule.forChild(),
                        NoDataMessageModule
                    ],
                    declarations: [CardGridComponent, CustomViewComponent],
                    exports: [CardGridComponent],
                    providers: [Store]
                }]
        }] });
//# sourceMappingURL=card-grid.module.js.map