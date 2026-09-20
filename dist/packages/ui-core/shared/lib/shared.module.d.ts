import { ModuleWithProviders } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/router";
import * as i4 from "ngx-permissions";
import * as i5 from "./components/components.module";
import * as i6 from "./directives/directives.module";
import * as i7 from "./pipes/pipes.module";
export declare class SharedModule {
    /**
     * Returns a ModuleWithProviders object that specifies the SharedModule and its providers.
     *
     * @return {ModuleWithProviders<SharedModule>} A ModuleWithProviders object with the SharedModule and its providers.
     */
    static forRoot(): ModuleWithProviders<SharedModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<SharedModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<SharedModule, never, [typeof i1.CommonModule, typeof i2.FormsModule, typeof i2.ReactiveFormsModule, typeof i3.RouterModule, typeof i4.NgxPermissionsModule, typeof i5.ComponentsModule, typeof i6.DirectivesModule, typeof i7.PipesModule], [typeof i1.CommonModule, typeof i2.FormsModule, typeof i2.ReactiveFormsModule, typeof i3.RouterModule, typeof i4.NgxPermissionsModule, typeof i5.ComponentsModule, typeof i6.DirectivesModule, typeof i7.PipesModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<SharedModule>;
}
