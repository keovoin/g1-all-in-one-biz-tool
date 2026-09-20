import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbIconModule, NbFormFieldModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@gauzy/ui-core/shared';
import { ThemeModule } from '@gauzy/ui-core/theme';
import { EmailCodeFormComponent } from './email-code-form/email-code-form.component';
import { WorkspaceHeaderComponent } from './workspace-header/workspace-header.component';
import { WorkspaceSelectionComponent } from './workspace-selection/workspace-selection.component';
import * as i0 from "@angular/core";
/**
 * Shared module for workspace action components.
 * Contains reusable UI components that are used across workspace-create, workspace-signin, and workspace-find.
 */
export class WorkspaceSharedModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceSharedModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceSharedModule, declarations: [EmailCodeFormComponent, WorkspaceHeaderComponent, WorkspaceSelectionComponent], imports: [CommonModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbIconModule,
            NbFormFieldModule,
            NbInputModule,
            NbTooltipModule,
            TranslateModule,
            SharedModule,
            ThemeModule], exports: [EmailCodeFormComponent, WorkspaceHeaderComponent, WorkspaceSelectionComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceSharedModule, imports: [CommonModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbIconModule,
            NbFormFieldModule,
            NbInputModule,
            NbTooltipModule,
            TranslateModule,
            SharedModule,
            ThemeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceSharedModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [EmailCodeFormComponent, WorkspaceHeaderComponent, WorkspaceSelectionComponent],
                    imports: [
                        CommonModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbIconModule,
                        NbFormFieldModule,
                        NbInputModule,
                        NbTooltipModule,
                        TranslateModule,
                        SharedModule,
                        ThemeModule
                    ],
                    exports: [EmailCodeFormComponent, WorkspaceHeaderComponent, WorkspaceSelectionComponent]
                }]
        }] });
//# sourceMappingURL=workspace-shared.module.js.map