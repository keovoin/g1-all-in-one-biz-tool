import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { RichTextEditorComponent } from './rich-text-editor.component';
import { RichTextToolbarComponent } from './rich-text-toolbar.component';
import * as i0 from "@angular/core";
export class RichTextEditorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RichTextEditorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: RichTextEditorModule, declarations: [RichTextEditorComponent, RichTextToolbarComponent], imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbTooltipModule,
            TranslateModule], exports: [RichTextEditorComponent, RichTextToolbarComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RichTextEditorModule, imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbTooltipModule,
            TranslateModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RichTextEditorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [RichTextEditorComponent, RichTextToolbarComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbButtonModule,
                        NbIconModule,
                        NbInputModule,
                        NbSelectModule,
                        NbTooltipModule,
                        TranslateModule
                    ],
                    exports: [RichTextEditorComponent, RichTextToolbarComponent]
                }]
        }] });
//# sourceMappingURL=rich-text-editor.module.js.map