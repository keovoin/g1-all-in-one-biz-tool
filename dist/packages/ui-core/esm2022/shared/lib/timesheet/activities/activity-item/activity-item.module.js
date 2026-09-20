import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbIconModule, NbProgressBarModule, NbTooltipModule } from '@nebular/theme';
import { MomentModule } from 'ngx-moment';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityItemComponent } from './activity-item.component';
import { SharedModule } from '../../../shared.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ActivityItemModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivityItemModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ActivityItemModule, declarations: [ActivityItemComponent], imports: [CommonModule,
            MomentModule,
            NbButtonModule,
            NbIconModule,
            NbProgressBarModule,
            NbTooltipModule, i1.TranslateModule, SharedModule], exports: [ActivityItemComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivityItemModule, imports: [CommonModule,
            MomentModule,
            NbButtonModule,
            NbIconModule,
            NbProgressBarModule,
            NbTooltipModule,
            TranslateModule.forChild(),
            SharedModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivityItemModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ActivityItemComponent],
                    exports: [ActivityItemComponent],
                    imports: [
                        CommonModule,
                        MomentModule,
                        NbButtonModule,
                        NbIconModule,
                        NbProgressBarModule,
                        NbTooltipModule,
                        TranslateModule.forChild(),
                        SharedModule
                    ]
                }]
        }] });
//# sourceMappingURL=activity-item.module.js.map