import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { Angular2SmartTableModule } from 'angular2-smart-table';
import { InvoicesService } from '@gauzy/ui-core/core';
import { SharedModule } from './../../../shared.module';
import { InvoiceViewInnerComponent } from './invoice-view-inner.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class InvoiceViewInnerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoiceViewInnerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: InvoiceViewInnerModule, declarations: [InvoiceViewInnerComponent], imports: [NbCardModule, Angular2SmartTableModule, i1.TranslateModule, SharedModule], exports: [InvoiceViewInnerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoiceViewInnerModule, providers: [InvoicesService], imports: [NbCardModule, Angular2SmartTableModule, TranslateModule.forChild(), SharedModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoiceViewInnerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NbCardModule, Angular2SmartTableModule, TranslateModule.forChild(), SharedModule],
                    declarations: [InvoiceViewInnerComponent],
                    exports: [InvoiceViewInnerComponent],
                    providers: [InvoicesService]
                }]
        }] });
//# sourceMappingURL=invoice-view-inner.module.js.map