import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsColorInputComponent } from './tags-color-input.component';
import { NbBadgeModule, NbSelectModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagsService } from '@gauzy/ui-core/core';
import { TranslateModule } from '@ngx-translate/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TagsColorInputModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsColorInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TagsColorInputModule, declarations: [TagsColorInputComponent], imports: [CommonModule, NbSelectModule, NbBadgeModule, FormsModule, NgSelectModule, i1.TranslateModule], exports: [TagsColorInputComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsColorInputModule, providers: [TagsService], imports: [CommonModule, NbSelectModule, NbBadgeModule, FormsModule, NgSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsColorInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbSelectModule, NbBadgeModule, FormsModule, NgSelectModule, TranslateModule.forChild()],
                    exports: [TagsColorInputComponent],
                    declarations: [TagsColorInputComponent],
                    providers: [TagsService]
                }]
        }] });
//# sourceMappingURL=tags-color-input.module.js.map