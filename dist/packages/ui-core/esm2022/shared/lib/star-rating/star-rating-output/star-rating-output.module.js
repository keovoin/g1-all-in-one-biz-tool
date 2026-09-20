import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule } from '@nebular/theme';
import { OrganizationsService } from '@gauzy/ui-core/core';
import { RoleService } from '@gauzy/ui-core/core';
import { StarRatingOutputComponent } from './star-rating-output.component';
import * as i0 from "@angular/core";
export class StarRatingOutputModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StarRatingOutputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: StarRatingOutputModule, declarations: [StarRatingOutputComponent], imports: [CommonModule, NbIconModule], exports: [StarRatingOutputComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StarRatingOutputModule, providers: [OrganizationsService, RoleService], imports: [CommonModule, NbIconModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StarRatingOutputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbIconModule],
                    exports: [StarRatingOutputComponent],
                    declarations: [StarRatingOutputComponent],
                    providers: [OrganizationsService, RoleService]
                }]
        }] });
//# sourceMappingURL=star-rating-output.module.js.map