import { inject, NgModule } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { evaToTablerIcons } from './eva-to-tabler-icons.map';
import * as i0 from "@angular/core";
export class TablerIconsModule {
    constructor() {
        this._iconLibraries = inject(NbIconLibraries);
        this.registerTablerPack();
    }
    registerTablerPack() {
        // We register this pack as 'eva' to maintain backward compatibility with existing usages of the Eva icon pack in templates and configuration.
        this._iconLibraries.registerSvgPack('eva', evaToTablerIcons);
        this._iconLibraries.setDefaultPack('eva');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TablerIconsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TablerIconsModule }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TablerIconsModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TablerIconsModule, decorators: [{
            type: NgModule
        }], ctorParameters: () => [] });
//# sourceMappingURL=icons.module.js.map