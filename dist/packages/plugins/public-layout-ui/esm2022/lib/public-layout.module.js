import { NgModule } from '@angular/core';
import { ROUTES, RouterModule } from '@angular/router';
import { NbActionsModule, NbBadgeModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbDialogModule, NbIconModule, NbInputModule, NbListModule, NbMenuModule, NbSelectModule, NbSpinnerModule, NbTabsetModule, NbTagModule, NbToastrModule, NbToggleModule, NbTooltipModule, NbUserModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LanguagesService, PageRouteRegistryService, SkillsService } from '@gauzy/ui-core/core';
import { AppointmentCalendarModule, CurrencyModule, ImageUploaderModule, InvoiceViewInnerModule, LanguageSelectorModule, ManageAppointmentModule, MiscellaneousModule, RichTextEditorModule, SelectorsModule, SharedModule, SkillsInputModule, TableComponentsModule, TagsColorInputModule, WorkInProgressModule } from '@gauzy/ui-core/shared';
import { ThemeModule } from '@gauzy/ui-core/theme';
import { COMPONENTS } from './components';
import { SanitizeHtmlPipe } from './pipes';
import { createPublicLayoutRoutes } from './public-layout.routes';
import * as i0 from "@angular/core";
import * as i1 from "./components/appointment-form/appointment-form.component";
import * as i2 from "./components/confirm-appointment/confirm-appointment.component";
import * as i3 from "./components/create-appointment/create-appointment.component";
import * as i4 from "./components/edit-appointment/edit-appointment.component";
import * as i5 from "./components/employee/employee.component";
import * as i6 from "./components/invoice-estimate/invoice-estimate-view.component";
import * as i7 from "./components/organization/organization.component";
import * as i8 from "./components/pick-employee/pick-employee.component";
import * as i9 from "./components/public-appointment/public-appointment.component";
import * as i10 from "./components/public-layout.component";
import * as i11 from "./components/mutation/public-page-employee-mutation/public-page-employee-mutation.component";
import * as i12 from "./components/mutation/public-page-organization-mutation/public-page-organization-mutation.component";
import * as i13 from "@angular/router";
import * as i14 from "@nebular/theme";
import * as i15 from "ngx-permissions";
import * as i16 from "@ngx-translate/core";
// Nebular Modules
const NB_MODULES = [
    NbActionsModule,
    NbBadgeModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbDialogModule.forChild(),
    NbIconModule,
    NbInputModule,
    NbListModule,
    NbMenuModule,
    NbSpinnerModule,
    NbSelectModule,
    NbTabsetModule,
    NbTagModule,
    NbToastrModule.forRoot(),
    NbToggleModule,
    NbTooltipModule,
    NbUserModule
];
/*
 * Third Party Modules
 */
const THIRD_PARTY_MODULES = [
    NgSelectModule,
    NgxPermissionsModule.forRoot(),
    TranslateModule.forChild()
];
/**
 * Feature Modules
 */
const FEATURE_MODULES = [
    AppointmentCalendarModule,
    CurrencyModule,
    ImageUploaderModule,
    InvoiceViewInnerModule,
    LanguageSelectorModule,
    ManageAppointmentModule,
    MiscellaneousModule,
    RichTextEditorModule,
    SelectorsModule,
    SharedModule,
    SkillsInputModule,
    TableComponentsModule,
    TagsColorInputModule,
    ThemeModule,
    WorkInProgressModule
];
export class PublicLayoutModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PublicLayoutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: PublicLayoutModule, declarations: [i1.AppointmentFormComponent, i2.ConfirmAppointmentComponent, i3.CreateAppointmentComponent, i4.EditAppointmentComponent, i5.EmployeeComponent, i6.InvoiceEstimateViewComponent, i7.OrganizationComponent, i8.PickEmployeeComponent, i9.PublicAppointmentComponent, i10.PublicLayoutComponent, i11.PublicPageEmployeeMutationComponent, i12.PublicPageOrganizationMutationComponent], imports: [i13.RouterModule, NbActionsModule,
            NbBadgeModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbDatepickerModule, i14.NbDialogModule, NbIconModule,
            NbInputModule,
            NbListModule,
            NbMenuModule,
            NbSpinnerModule,
            NbSelectModule,
            NbTabsetModule,
            NbTagModule, i14.NbToastrModule, NbToggleModule,
            NbTooltipModule,
            NbUserModule, NgSelectModule, i15.NgxPermissionsModule, i16.TranslateModule, AppointmentCalendarModule,
            CurrencyModule,
            ImageUploaderModule,
            InvoiceViewInnerModule,
            LanguageSelectorModule,
            ManageAppointmentModule,
            MiscellaneousModule,
            RichTextEditorModule,
            SelectorsModule,
            SharedModule,
            SkillsInputModule,
            TableComponentsModule,
            TagsColorInputModule,
            ThemeModule,
            WorkInProgressModule, 
            // Standalone: the public pages render editor-authored HTML for anonymous visitors, so
            // they sanitize it themselves instead of reaching for the shared `safeHtml` bypass.
            SanitizeHtmlPipe], exports: [i1.AppointmentFormComponent, i2.ConfirmAppointmentComponent, i3.CreateAppointmentComponent, i4.EditAppointmentComponent, i5.EmployeeComponent, i6.InvoiceEstimateViewComponent, i7.OrganizationComponent, i8.PickEmployeeComponent, i9.PublicAppointmentComponent, i10.PublicLayoutComponent, i11.PublicPageEmployeeMutationComponent, i12.PublicPageOrganizationMutationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PublicLayoutModule, providers: [
            LanguagesService,
            SkillsService,
            {
                provide: ROUTES,
                useFactory: (service) => createPublicLayoutRoutes(service),
                deps: [PageRouteRegistryService],
                multi: true
            }
        ], imports: [RouterModule.forChild([]), NB_MODULES, THIRD_PARTY_MODULES, FEATURE_MODULES] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PublicLayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [...COMPONENTS],
                    imports: [
                        RouterModule.forChild([]),
                        ...NB_MODULES,
                        ...THIRD_PARTY_MODULES,
                        ...FEATURE_MODULES,
                        // Standalone: the public pages render editor-authored HTML for anonymous visitors, so
                        // they sanitize it themselves instead of reaching for the shared `safeHtml` bypass.
                        SanitizeHtmlPipe
                    ],
                    exports: [...COMPONENTS],
                    providers: [
                        LanguagesService,
                        SkillsService,
                        {
                            provide: ROUTES,
                            useFactory: (service) => createPublicLayoutRoutes(service),
                            deps: [PageRouteRegistryService],
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=public-layout.module.js.map