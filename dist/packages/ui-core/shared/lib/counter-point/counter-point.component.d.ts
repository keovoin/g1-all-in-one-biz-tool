import { progressStatus } from '@gauzy/ui-core/common';
import { Point } from './point/point.class';
import * as i0 from "@angular/core";
export declare class CounterPointComponent {
    getProgressStatus: typeof progressStatus;
    total: import("@angular/core").InputSignal<number>;
    value: import("@angular/core").InputSignal<number>;
    color: import("@angular/core").InputSignal<string>;
    progress: import("@angular/core").InputSignal<boolean>;
    points: import("@angular/core").Signal<Point[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CounterPointComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CounterPointComponent, "gauzy-counter-point", never, { "total": { "alias": "total"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "color": { "alias": "color"; "required": false; "isSignal": true; }; "progress": { "alias": "progress"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
