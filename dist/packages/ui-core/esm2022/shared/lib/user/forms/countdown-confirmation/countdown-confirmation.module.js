import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { CountdownComponent } from 'ngx-countdown';
import { CountdownConfirmationComponent } from './countdown-confirmation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class CountdownConfirmationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountdownConfirmationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CountdownConfirmationModule, declarations: [CountdownConfirmationComponent], imports: [NbCardModule, NbButtonModule, i1.TranslateModule, CountdownComponent], exports: [CountdownConfirmationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountdownConfirmationModule, imports: [NbCardModule, NbButtonModule, TranslateModule.forChild(), CountdownComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountdownConfirmationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NbCardModule, NbButtonModule, TranslateModule.forChild(), CountdownComponent],
                    declarations: [CountdownConfirmationComponent],
                    exports: [CountdownConfirmationComponent]
                }]
        }] });
//# sourceMappingURL=countdown-confirmation.module.js.map