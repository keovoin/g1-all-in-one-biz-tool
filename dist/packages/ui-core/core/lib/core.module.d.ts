import { ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs';
import { NbRoleProvider } from '@nebular/security';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./auth/auth.module";
import * as i3 from "@nebular/auth";
export declare class NbSimpleRoleProvider extends NbRoleProvider {
    getRole(): Observable<string | string[]>;
}
export declare const NB_CORE_PROVIDERS: any[];
export declare class CoreModule {
    constructor(parentModule: CoreModule);
    /**
     * Returns a ModuleWithProviders object that specifies the CoreModule and its providers.
     *
     * @return {ModuleWithProviders<CoreModule>} A ModuleWithProviders object with the CoreModule and its providers.
     */
    static forRoot(): ModuleWithProviders<CoreModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CoreModule, [{ optional: true; skipSelf: true; }]>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<CoreModule, never, [typeof i1.CommonModule, typeof i2.AuthModule], [typeof i3.NbAuthModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<CoreModule>;
}
