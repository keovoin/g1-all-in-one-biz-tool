import { NgModule } from '@angular/core';
import { Pipes } from './index';
import * as i0 from "@angular/core";
import * as i1 from "./capitalize.pipe";
import * as i2 from "./currency-position.pipe";
import * as i3 from "./date-format.pipe";
import * as i4 from "./datetime-format.pipe";
import * as i5 from "./duration-format.pipe";
import * as i6 from "./file-size.pipe";
import * as i7 from "./filter-array.pipe";
import * as i8 from "./hash-number.pipe";
import * as i9 from "./budget.pipe";
import * as i10 from "./nl2br.pipe";
import * as i11 from "./replace.pipe";
import * as i12 from "./safe-html.pipe";
import * as i13 from "./safe-url.pipe";
import * as i14 from "./time-format.pipe";
import * as i15 from "./truncate.pipe";
import * as i16 from "./utc-to-local.pipe";
import * as i17 from "./utc-to-timezone.pipe";
export class PipesModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PipesModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: PipesModule, imports: [i1.CapitalizePipe, i2.CurrencyPositionPipe, i3.DateFormatPipe, i4.DateTimeFormatPipe, i5.DurationFormatPipe, i6.FileSizePipe, i7.FilterArrayPipe, i8.HashNumberPipe, i9.JobBudgetPipe, i10.Nl2BrPipe, i11.ReplacePipe, i12.SafeHtmlPipe, i13.SafeUrlPipe, i14.TimeFormatPipe, i15.TruncatePipe, i16.UtcToLocalPipe, i17.UtcToTimezone], exports: [i1.CapitalizePipe, i2.CurrencyPositionPipe, i3.DateFormatPipe, i4.DateTimeFormatPipe, i5.DurationFormatPipe, i6.FileSizePipe, i7.FilterArrayPipe, i8.HashNumberPipe, i9.JobBudgetPipe, i10.Nl2BrPipe, i11.ReplacePipe, i12.SafeHtmlPipe, i13.SafeUrlPipe, i14.TimeFormatPipe, i15.TruncatePipe, i16.UtcToLocalPipe, i17.UtcToTimezone] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PipesModule, providers: [...Pipes] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PipesModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [...Pipes],
                    exports: [...Pipes],
                    providers: [...Pipes]
                }]
        }] });
//# sourceMappingURL=pipes.module.js.map