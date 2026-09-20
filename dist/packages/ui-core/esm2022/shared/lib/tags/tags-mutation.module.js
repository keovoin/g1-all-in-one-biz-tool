import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { ColorPickerComponent, ColorPickerDirective } from 'ngx-color-picker';
import { TranslateModule } from '@ngx-translate/core';
import { TagsService } from '@gauzy/ui-core/core';
import { TagsMutationComponent } from './tags-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TagsMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TagsMutationModule, declarations: [TagsMutationComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbTooltipModule,
            ColorPickerComponent,
            ColorPickerDirective, i1.TranslateModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsMutationModule, providers: [TagsService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbTooltipModule,
            ColorPickerComponent,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbCheckboxModule,
                        NbIconModule,
                        NbInputModule,
                        NbSelectModule,
                        NbTooltipModule,
                        ColorPickerComponent,
                        ColorPickerDirective,
                        TranslateModule.forChild()
                    ],
                    declarations: [TagsMutationComponent],
                    providers: [TagsService]
                }]
        }] });
//# sourceMappingURL=tags-mutation.module.js.map