import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbIconModule, NbCardModule, NbButtonModule, NbInputModule, NbSelectModule, NbCheckboxModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@gauzy/ui-core/core';
import { EquipmentService, ImageAssetService } from '@gauzy/ui-core/core';
import { TagsColorInputModule } from '../tags/tags-color-input/tags-color-input.module';
import { CurrencyModule } from '../modules/currency/currency.module';
import { EquipmentMutationComponent } from './equipment-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class EquipmentMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EquipmentMutationModule, declarations: [EquipmentMutationComponent], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbCheckboxModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbInputModule,
            NbSelectModule, i1.TranslateModule, TagsColorInputModule,
            CurrencyModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentMutationModule, providers: [EquipmentService, ImageAssetService, Store], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbCheckboxModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbInputModule,
            NbSelectModule,
            TranslateModule.forChild(),
            TagsColorInputModule,
            CurrencyModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbCardModule,
                        NbIconModule,
                        NbCheckboxModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbInputModule,
                        NbSelectModule,
                        TranslateModule.forChild(),
                        TagsColorInputModule,
                        CurrencyModule
                    ],
                    declarations: [EquipmentMutationComponent],
                    providers: [EquipmentService, ImageAssetService, Store]
                }]
        }] });
//# sourceMappingURL=equipment-mutation.module.js.map