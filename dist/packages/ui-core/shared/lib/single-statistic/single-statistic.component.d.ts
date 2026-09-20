import { OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class SingleStatisticComponent implements OnInit {
    title: string;
    prefix: string;
    value: string;
    suffix: string;
    type: string;
    color: string;
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SingleStatisticComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SingleStatisticComponent, "ga-single-statistic", never, { "title": { "alias": "title"; "required": false; }; "prefix": { "alias": "prefix"; "required": false; }; "value": { "alias": "value"; "required": false; }; "suffix": { "alias": "suffix"; "required": false; }; "type": { "alias": "type"; "required": false; }; "color": { "alias": "color"; "required": false; }; }, {}, never, never, false, never>;
}
