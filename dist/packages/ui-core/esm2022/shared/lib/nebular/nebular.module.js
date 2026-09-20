import { NgModule } from '@angular/core';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbPopoverModule, NbRadioModule, NbSelectModule, NbSpinnerModule, NbTabsetModule, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
/**
 * Common Nebular modules used across multiple UI plugins.
 *
 * Import `NebularModule` instead of listing individual `Nb*Module`
 * imports in every plugin / feature module.
 *
 * Modules that require `.forRoot()` or `.forChild()` configuration
 * (e.g. `NbDialogModule.forChild()`) are included with `.forChild()`
 * so this module is safe to import in lazy-loaded feature modules.
 */
const NB_MODULES = [
    NbBadgeModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbPopoverModule,
    NbRadioModule,
    NbSelectModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbToggleModule,
    NbTooltipModule
];
export class NebularModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NebularModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: NebularModule, imports: [NbBadgeModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbDatepickerModule,
            NbFormFieldModule,
            NbIconModule,
            NbInputModule,
            NbPopoverModule,
            NbRadioModule,
            NbSelectModule,
            NbSpinnerModule,
            NbTabsetModule,
            NbToggleModule,
            NbTooltipModule, i1.NbDialogModule], exports: [NbBadgeModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbDatepickerModule,
            NbFormFieldModule,
            NbIconModule,
            NbInputModule,
            NbPopoverModule,
            NbRadioModule,
            NbSelectModule,
            NbSpinnerModule,
            NbTabsetModule,
            NbToggleModule,
            NbTooltipModule, NbDialogModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NebularModule, imports: [NB_MODULES, NbDialogModule.forChild(), NbBadgeModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbDatepickerModule,
            NbFormFieldModule,
            NbIconModule,
            NbInputModule,
            NbPopoverModule,
            NbRadioModule,
            NbSelectModule,
            NbSpinnerModule,
            NbTabsetModule,
            NbToggleModule,
            NbTooltipModule, NbDialogModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NebularModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [...NB_MODULES, NbDialogModule.forChild()],
                    exports: [...NB_MODULES, NbDialogModule]
                }]
        }] });
//# sourceMappingURL=nebular.module.js.map