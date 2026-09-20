import { Pipe } from '@angular/core';
import moment from 'moment';
import { toTimezone } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
export class UtcToTimezone {
    /**
     * Transforms the given date/time value to the specified timezone and returns it as a JavaScript Date object.
     *
     * @param value The date/time value to be transformed. Can be a string, Date, or moment object.
     * @param timezone The IANA timezone identifier (e.g., 'America/New_York', 'Europe/London') to which the date should be converted.
     * @param format The format to be used when parsing the date if initial parsing fails. Default is 'HH:mm'.
     * @returns A JavaScript Date object representing the date/time in the specified timezone.
     */
    transform(value, timezone, format = 'YYYY-MM-DD HH:mm:ss') {
        let date = moment(value);
        if (!date.isValid())
            date = moment.utc(value, format);
        if (timezone)
            return toTimezone(date, timezone).format(format);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UtcToTimezone, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: UtcToTimezone, isStandalone: true, name: "utcToTimezone" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UtcToTimezone, decorators: [{
            type: Pipe,
            args: [{
                    name: 'utcToTimezone',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=utc-to-timezone.pipe.js.map