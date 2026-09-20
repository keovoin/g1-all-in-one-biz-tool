import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NbSelectModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TeamSelectorComponent } from './team/team.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TeamSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TeamSelectModule, declarations: [TeamSelectorComponent], imports: [CommonModule, NbSelectModule, FormsModule, i1.TranslateModule, NgSelectModule], exports: [TeamSelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamSelectModule, imports: [CommonModule, NbSelectModule, FormsModule, TranslateModule.forChild(), NgSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TeamSelectorComponent],
                    exports: [TeamSelectorComponent],
                    imports: [CommonModule, NbSelectModule, FormsModule, TranslateModule.forChild(), NgSelectModule]
                }]
        }] });
//# sourceMappingURL=team.module.js.map