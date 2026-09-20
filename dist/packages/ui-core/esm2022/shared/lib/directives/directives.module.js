import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIRECTIVES } from './index';
import * as i0 from "@angular/core";
import * as i1 from "./autocomplete-off.directive";
import * as i2 from "./debounce-click.directive";
import * as i3 from "./img.directive";
import * as i4 from "./read-more.directive";
import * as i5 from "./time-tracking-authorized-directive";
import * as i6 from "./outside.directive";
import * as i7 from "./under-construction.directive";
import * as i8 from "./no-space-edges.directive";
import * as i9 from "./text-mask.directive";
import * as i10 from "./trigger-parent-click.directive";
export class DirectivesModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DirectivesModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DirectivesModule, imports: [CommonModule, i1.AutocompleteOffDirective, i2.DebounceClickDirective, i3.ImgDirective, i4.ReadMoreDirective, i5.TimeTrackingAuthorizedDirective, i6.OutsideDirective, i7.UnderConstructionDirective, i8.NoSpaceEdgesDirective, i9.TextMaskDirective, i10.TriggerParentClickDirective], exports: [i1.AutocompleteOffDirective, i2.DebounceClickDirective, i3.ImgDirective, i4.ReadMoreDirective, i5.TimeTrackingAuthorizedDirective, i6.OutsideDirective, i7.UnderConstructionDirective, i8.NoSpaceEdgesDirective, i9.TextMaskDirective, i10.TriggerParentClickDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DirectivesModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DirectivesModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ...DIRECTIVES],
                    exports: [...DIRECTIVES]
                }]
        }] });
//# sourceMappingURL=directives.module.js.map