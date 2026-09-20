import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class DurationFormatPipe {
    /**
     * Transforms the given number of seconds into a formatted duration string in the format HH:mm:ss.
     *
     * @param {number} seconds - The number of seconds to transform.
     * @return {string} The formatted duration string in the format HH:mm:ss.
     */
    transform(seconds) {
        let duration = seconds < 0 ? 0 : seconds;
        let hours = parseInt(duration / 3600 + '', 10);
        duration = duration % 3600;
        let min = parseInt(duration / 60 + '', 10);
        duration = duration % 60;
        let sec = parseInt(duration + '', 10);
        if (sec < 10) {
            sec = `0${sec}`;
        }
        if (min < 10) {
            min = `0${min}`;
        }
        if (hours < 10) {
            hours = `0${hours}`;
        }
        return `${hours}:${min}:${sec}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DurationFormatPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DurationFormatPipe, isStandalone: true, name: "durationFormat" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DurationFormatPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'durationFormat',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=duration-format.pipe.js.map