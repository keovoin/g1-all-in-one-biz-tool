import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NbDialogModule, NbRadioModule, NbListModule, NbButtonModule, NbInputModule, NbSelectModule, NbCardModule, NbIconModule, NbCheckboxModule, NbFormFieldModule, NbMenuModule, NbBadgeModule, NbTagModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { AlertDirective, ConfirmDirective, PromptDirective } from './directive';
import { AlertComponent } from './alert/alert.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { PromptComponent } from './prompt/prompt.component';
import { QuickActionsComponent } from './quick-actions/quick-actions.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
const Directives = [AlertDirective, ConfirmDirective, PromptDirective];
const Components = [AlertComponent, ConfirmComponent, PromptComponent, QuickActionsComponent];
export class DialogsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DialogsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DialogsModule, declarations: [AlertComponent, ConfirmComponent, PromptComponent, QuickActionsComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbBadgeModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbDialogModule,
            NbFormFieldModule,
            NbIconModule,
            NbInputModule,
            NbListModule,
            NbMenuModule,
            NbRadioModule,
            NbSelectModule,
            NbTagModule, i1.TranslateModule, AlertDirective, ConfirmDirective, PromptDirective], exports: [AlertDirective, ConfirmDirective, PromptDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DialogsModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbBadgeModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbDialogModule,
            NbFormFieldModule,
            NbIconModule,
            NbInputModule,
            NbListModule,
            NbMenuModule,
            NbRadioModule,
            NbSelectModule,
            NbTagModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DialogsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbBadgeModule,
                        NbButtonModule,
                        NbCardModule,
                        NbCheckboxModule,
                        NbDialogModule,
                        NbFormFieldModule,
                        NbIconModule,
                        NbInputModule,
                        NbListModule,
                        NbMenuModule,
                        NbRadioModule,
                        NbSelectModule,
                        NbTagModule,
                        TranslateModule.forChild(),
                        ...Directives
                    ],
                    declarations: [...Components],
                    exports: [...Directives],
                    providers: []
                }]
        }] });
//# sourceMappingURL=dialogs.module.js.map