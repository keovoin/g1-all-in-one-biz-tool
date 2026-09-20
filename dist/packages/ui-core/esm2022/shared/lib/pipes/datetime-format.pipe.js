import { __decorate, __metadata } from "tslib";
import { Pipe, inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import moment from 'moment';
import { RegionsEnum, TimeFormatEnum } from '@gauzy/contracts';
import { isEmpty } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
let DateTimeFormatPipe = class DateTimeFormatPipe {
    constructor() {
        this.store = inject(Store);
        this.timeFormat = TimeFormatEnum.FORMAT_12_HOURS;
        this.dateFormat = 'd MMMM, y H:mm';
        this.regionCode = RegionsEnum.EN;
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), untilDestroyed(this))
            .subscribe((organization) => {
            const { regionCode, dateFormat, timeFormat } = organization;
            if (regionCode) {
                this.regionCode = regionCode;
            }
            if (dateFormat) {
                this.dateFormat = dateFormat;
            }
            if (timeFormat) {
                this.timeFormat = timeFormat;
            }
        });
    }
    /**
     * Transforms a given date value into a formatted string based on provided format and locale.
     *
     * @param value The date value to transform.
     * @param format The format to apply to the date.
     * @param locale The locale to use for formatting.
     * @param seconds Whether to include seconds in the time format.
     * @returns The formatted date string.
     */
    transform(value, format, locale, seconds = true) {
        if (!value) {
            return;
        }
        let date = moment(value);
        if (!date.isValid())
            date = moment.utc(value);
        if (isEmpty(format)) {
            const timeFormat = this.timeFormat === TimeFormatEnum.FORMAT_12_HOURS
                ? `hh:mm${seconds ? ':ss' : ''} A`
                : `HH:mm${seconds ? ':ss' : ''}`;
            format = `${this.dateFormat} ${timeFormat}`;
        }
        if (isEmpty(locale))
            locale = this.regionCode || RegionsEnum.EN;
        return date.locale(locale).format(format);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DateTimeFormatPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DateTimeFormatPipe, isStandalone: true, name: "dateTimeFormat", pure: false }); }
};
DateTimeFormatPipe = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], DateTimeFormatPipe);
export { DateTimeFormatPipe };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DateTimeFormatPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'dateTimeFormat',
                    pure: false,
                    standalone: true
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=datetime-format.pipe.js.map