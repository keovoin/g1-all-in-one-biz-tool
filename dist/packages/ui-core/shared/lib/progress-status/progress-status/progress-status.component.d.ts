import { OnInit } from '@angular/core';
import { progressStatus } from '@gauzy/ui-core/common';
import { NbComponentOrCustomStatus } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class ProgressStatusComponent implements OnInit {
    progressStatus: typeof progressStatus;
    private _percentage;
    get percentage(): number;
    set percentage(value: number);
    private _defaultStatus;
    get defaultStatus(): NbComponentOrCustomStatus;
    set defaultStatus(value: NbComponentOrCustomStatus);
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProgressStatusComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProgressStatusComponent, "ngx-progress-status", never, { "percentage": { "alias": "percentage"; "required": false; }; "defaultStatus": { "alias": "defaultStatus"; "required": false; }; }, {}, never, never, false, never>;
}
