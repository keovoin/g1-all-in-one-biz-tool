import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbToggleModule } from '@nebular/theme';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ExpenseCategorySelectModule } from '../expenses/expense-category-select/expense-category-select.module';
import { VendorSelectModule } from '../vendor-select/vendor-select.module';
import { ExpenseCategoryFilterComponent } from './expense-category-filter.component';
import { InputFilterComponent } from './input-filter.component';
import { InviteStatusFilterComponent } from './invite-status-filter.component';
import { OrganizationContactFilterComponent } from './organization-contact-filter.component';
import { PaymentMethodFilterComponent } from './payment-method-filter.component';
import { TagsColorFilterComponent } from './tags-color-filter.component';
import { OrganizationTeamFilterComponent } from './organization-team-filter.component';
import { VendorFilterComponent } from './vendor-filter.component';
import { TaskStatusFilterComponent } from './task-status-filter.component';
import { ToggleFilterComponent } from './toggle-filter/toggle-filter.component';
import { TagsColorInputModule } from '../tags/tags-color-input/tags-color-input.module';
import { ContactSelectModule } from '../contact-select/contact-select.module';
import { TaskStatusSelectModule } from '../tasks/task-status-select/task-status-select.module';
import { RangeFilterComponent } from './range-filter.component';
import { ProductCategorySelectorModule, ProductTypeSelectorModule } from '../product';
import { ProductCategoryFilterComponent } from './product-category-filter.component';
import { ProductTypeFilterComponent } from './product-type-filter.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TableFiltersModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TableFiltersModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TableFiltersModule, declarations: [OrganizationContactFilterComponent,
            PaymentMethodFilterComponent,
            TagsColorFilterComponent,
            VendorFilterComponent,
            ExpenseCategoryFilterComponent,
            ProductCategoryFilterComponent,
            ProductTypeFilterComponent,
            InputFilterComponent,
            InviteStatusFilterComponent,
            RangeFilterComponent,
            OrganizationTeamFilterComponent,
            TaskStatusFilterComponent,
            ToggleFilterComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule, i1.TranslateModule, TagsColorInputModule,
            VendorSelectModule,
            ExpenseCategorySelectModule,
            ProductCategorySelectorModule,
            ProductTypeSelectorModule,
            ContactSelectModule,
            TaskStatusSelectModule,
            NbToggleModule,
            FontAwesomeModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TableFiltersModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule,
            TranslateModule.forChild(),
            TagsColorInputModule,
            VendorSelectModule,
            ExpenseCategorySelectModule,
            ProductCategorySelectorModule,
            ProductTypeSelectorModule,
            ContactSelectModule,
            TaskStatusSelectModule,
            NbToggleModule,
            FontAwesomeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TableFiltersModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NgSelectModule,
                        TranslateModule.forChild(),
                        TagsColorInputModule,
                        VendorSelectModule,
                        ExpenseCategorySelectModule,
                        ProductCategorySelectorModule,
                        ProductTypeSelectorModule,
                        ContactSelectModule,
                        TaskStatusSelectModule,
                        NbToggleModule,
                        FontAwesomeModule
                    ],
                    declarations: [
                        OrganizationContactFilterComponent,
                        PaymentMethodFilterComponent,
                        TagsColorFilterComponent,
                        VendorFilterComponent,
                        ExpenseCategoryFilterComponent,
                        ProductCategoryFilterComponent,
                        ProductTypeFilterComponent,
                        InputFilterComponent,
                        InviteStatusFilterComponent,
                        RangeFilterComponent,
                        OrganizationTeamFilterComponent,
                        TaskStatusFilterComponent,
                        ToggleFilterComponent
                    ],
                    exports: [],
                    providers: []
                }]
        }] });
//# sourceMappingURL=table-filters.module.js.map