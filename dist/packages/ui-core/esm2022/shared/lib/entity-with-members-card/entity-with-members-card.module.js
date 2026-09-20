import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSelectModule, NbToastrModule, NbTooltipModule, NbBadgeModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { TableComponentsModule } from '../table-components/table-components.module';
import { EntityWithMembersCardComponent } from './entity-with-members-card.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class EntityWithMembersModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EntityWithMembersModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EntityWithMembersModule, declarations: [EntityWithMembersCardComponent], imports: [CommonModule,
            NbBadgeModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbTooltipModule, i1.NbToastrModule, i2.TranslateModule, TableComponentsModule], exports: [EntityWithMembersCardComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EntityWithMembersModule, imports: [CommonModule,
            NbBadgeModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbTooltipModule,
            NbToastrModule.forRoot(),
            TranslateModule.forChild(),
            TableComponentsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EntityWithMembersModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbBadgeModule,
                        NbCardModule,
                        NbButtonModule,
                        NbIconModule,
                        NbInputModule,
                        NbSelectModule,
                        NbTooltipModule,
                        NbToastrModule.forRoot(),
                        TranslateModule.forChild(),
                        TableComponentsModule
                    ],
                    declarations: [EntityWithMembersCardComponent],
                    exports: [EntityWithMembersCardComponent]
                }]
        }] });
//# sourceMappingURL=entity-with-members-card.module.js.map