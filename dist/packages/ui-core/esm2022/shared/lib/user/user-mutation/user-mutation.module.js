import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { UserMutationComponent } from './user-mutation.component';
import { UserFormsModule } from '../forms/user-forms.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class UserMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: UserMutationModule, declarations: [UserMutationComponent], imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule, i1.TranslateModule, UserFormsModule], exports: [UserMutationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserMutationModule, imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            TranslateModule.forChild(),
            UserFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        TranslateModule.forChild(),
                        UserFormsModule
                    ],
                    exports: [UserMutationComponent],
                    declarations: [UserMutationComponent],
                    providers: []
                }]
        }] });
//# sourceMappingURL=user-mutation.module.js.map