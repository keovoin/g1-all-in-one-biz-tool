import { Pipe } from '@angular/core';
import moment from 'moment';
import { toLocal } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
export class UtcToLocalPipe {
    /**
     * Transforms the given date/time value to the local timezone and returns it as a JavaScript Date object.
     * @param value The date/time value to be transformed. Can be a string, Date, or moment object.
     * @param format The format to be used when parsing the date if initial parsing fails. Default is 'HH:mm'.
     * @returns A JavaScript Date object representing the date/time in the local timezone.
     */
    transform(value, format = 'HH:mm') {
        let date = moment(value);
        if (!date.isValid())
            date = moment.utc(value, format);
        return toLocal(date).toDate();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UtcToLocalPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: UtcToLocalPipe, isStandalone: true, name: "utcToLocal" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UtcToLocalPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'utcToLocal',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=utc-to-local.pipe.js.map