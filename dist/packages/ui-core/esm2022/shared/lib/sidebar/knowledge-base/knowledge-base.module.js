import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSelectModule, NbToggleModule } from '@nebular/theme';
import { ColorPickerComponent, ColorPickerDirective, ColorPickerService } from 'ngx-color-picker';
import { TranslateModule } from '@ngx-translate/core';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { LanguageSelectorModule } from '../../language/language-selector';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class KnowledgeBaseModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: KnowledgeBaseModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: KnowledgeBaseModule, declarations: [KnowledgeBaseComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbToggleModule,
            ColorPickerComponent,
            ColorPickerDirective, i1.TranslateModule, LanguageSelectorModule], exports: [KnowledgeBaseComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: KnowledgeBaseModule, providers: [ColorPickerService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbToggleModule,
            ColorPickerComponent,
            TranslateModule.forChild(),
            LanguageSelectorModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: KnowledgeBaseModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        NbInputModule,
                        NbSelectModule,
                        NbToggleModule,
                        ColorPickerComponent,
                        ColorPickerDirective,
                        TranslateModule.forChild(),
                        LanguageSelectorModule
                    ],
                    declarations: [KnowledgeBaseComponent],
                    exports: [KnowledgeBaseComponent],
                    providers: [ColorPickerService]
                }]
        }] });
//# sourceMappingURL=knowledge-base.module.js.map