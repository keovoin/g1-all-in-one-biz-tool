import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule } from '@nebular/theme';
import { OrganizationsService } from '@gauzy/ui-core/core';
import { RoleService } from '@gauzy/ui-core/core';
import { StarRatingInputComponent } from './star-rating-input.component';
import * as i0 from "@angular/core";
export class StarRatingInputModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StarRatingInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: StarRatingInputModule, declarations: [StarRatingInputComponent], imports: [CommonModule, NbIconModule], exports: [StarRatingInputComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StarRatingInputModule, providers: [OrganizationsService, RoleService], imports: [CommonModule, NbIconModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StarRatingInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbIconModule],
                    exports: [StarRatingInputComponent],
                    declarations: [StarRatingInputComponent],
                    providers: [OrganizationsService, RoleService]
                }]
        }] });
//# sourceMappingURL=star-rating-input.module.js.map