import { OnInit } from '@angular/core';
import { ComponentLayoutStyleEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class StatusBadgeComponent implements OnInit {
    text: string;
    badgeClass: string;
    value: any;
    layout?: ComponentLayoutStyleEnum | undefined;
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<StatusBadgeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<StatusBadgeComponent, "ga-status-badge", never, { "value": { "alias": "value"; "required": false; }; "layout": { "alias": "layout"; "required": false; }; }, {}, never, never, false, never>;
}
