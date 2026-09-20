import { __decorate, __metadata } from "tslib";
import { Pipe, inject } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import moment from 'moment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TimeFormatEnum } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
let TimeFormatPipe = class TimeFormatPipe {
    constructor() {
        this.store = inject(Store);
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => {
            this.format = organization?.timeFormat ?? TimeFormatEnum.FORMAT_12_HOURS;
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Transforms a given value into a formatted time string.
     * @param value The value to transform into a time string. This can be a string, number, Date object, or any value parsable by moment.js.
     * @param timeFormat The time format to use. If not provided, it defaults to `this.format`.
     * @param seconds Optional. If true, include seconds in the formatted time string. Defaults to false.
     * @returns A formatted time string based on the input value and format options.
     */
    transform(value, timeFormat = this.format, seconds = true) {
        let format = 'HH:mm' + (seconds ? ':ss' : '');
        if (timeFormat === TimeFormatEnum.FORMAT_12_HOURS) {
            format = 'hh:mm' + (seconds ? ':ss' : '') + ' A';
        }
        let date = moment(value);
        if (!date.isValid())
            date = moment.utc(value, 'HH:mm');
        return date.format(format);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeFormatPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TimeFormatPipe, isStandalone: true, name: "timeFormat", pure: false }); }
};
TimeFormatPipe = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], TimeFormatPipe);
export { TimeFormatPipe };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeFormatPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'timeFormat',
                    pure: false,
                    standalone: true
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=time-format.pipe.js.map