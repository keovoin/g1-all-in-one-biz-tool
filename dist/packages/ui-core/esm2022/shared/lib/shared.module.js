import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ComponentsModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.module';
import * as i0 from "@angular/core";
const IMPORTS_EXPORTS = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxPermissionsModule,
    ComponentsModule,
    DirectivesModule,
    PipesModule
];
export class SharedModule {
    /**
     * Returns a ModuleWithProviders object that specifies the SharedModule and its providers.
     *
     * @return {ModuleWithProviders<SharedModule>} A ModuleWithProviders object with the SharedModule and its providers.
     */
    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SharedModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: SharedModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            RouterModule,
            NgxPermissionsModule,
            ComponentsModule,
            DirectivesModule,
            PipesModule], exports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            RouterModule,
            NgxPermissionsModule,
            ComponentsModule,
            DirectivesModule,
            PipesModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SharedModule, imports: [IMPORTS_EXPORTS, CommonModule,
            FormsModule,
            ReactiveFormsModule,
            RouterModule,
            NgxPermissionsModule,
            ComponentsModule,
            DirectivesModule,
            PipesModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SharedModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [...IMPORTS_EXPORTS],
                    exports: [...IMPORTS_EXPORTS]
                }]
        }] });
//# sourceMappingURL=shared.module.js.map