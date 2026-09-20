import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbActionsModule, NbButtonModule, NbCardModule, NbContextMenuModule, NbIconModule, NbInputModule, NbLayoutModule, NbSelectModule, NbSidebarModule } from '@nebular/theme';
import { TreeModule } from '@ali-hm/angular-tree-component';
import { TranslateModule } from '@ngx-translate/core';
import { HelpCenterService } from '@gauzy/ui-core/core';
import { AddIconModule } from './add-icon/add-icon.module';
import { SidebarComponent } from './sidebar.component';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { DeleteCategoryModule } from './delete-category/delete-category.module';
import { DeleteBaseModule } from './delete-base/delete-base.module';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class SidebarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SidebarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: SidebarModule, declarations: [SidebarComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbActionsModule,
            NbButtonModule,
            NbCardModule,
            NbContextMenuModule,
            NbIconModule,
            NbInputModule,
            NbLayoutModule,
            NbSelectModule, i1.NbSidebarModule, TreeModule, i2.TranslateModule, AddIconModule,
            KnowledgeBaseModule,
            DeleteBaseModule,
            DeleteCategoryModule], exports: [SidebarComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SidebarModule, providers: [HelpCenterService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbActionsModule,
            NbButtonModule,
            NbCardModule,
            NbContextMenuModule,
            NbIconModule,
            NbInputModule,
            NbLayoutModule,
            NbSelectModule,
            NbSidebarModule.forRoot(),
            TreeModule,
            TranslateModule.forChild(),
            AddIconModule,
            KnowledgeBaseModule,
            DeleteBaseModule,
            DeleteCategoryModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SidebarModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbActionsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbContextMenuModule,
                        NbIconModule,
                        NbInputModule,
                        NbLayoutModule,
                        NbSelectModule,
                        NbSidebarModule.forRoot(),
                        TreeModule,
                        TranslateModule.forChild(),
                        AddIconModule,
                        KnowledgeBaseModule,
                        DeleteBaseModule,
                        DeleteCategoryModule
                    ],
                    providers: [HelpCenterService],
                    declarations: [SidebarComponent],
                    exports: [SidebarComponent]
                }]
        }] });
//# sourceMappingURL=sidebar.module.js.map