import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class TimezoneSelectorComponent extends TranslationBaseComponent implements OnInit {
    private readonly dialogRef;
    readonly translateService: TranslateService;
    listOfZones: string[];
    selectedTimezone: string;
    constructor(dialogRef: NbDialogRef<TimezoneSelectorComponent>, translateService: TranslateService);
    ngOnInit(): void;
    close(): void;
    getTimeWithOffset(zone: string): string;
    select(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimezoneSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimezoneSelectorComponent, "ng-component", never, { "selectedTimezone": { "alias": "selectedTimezone"; "required": false; }; }, {}, never, never, false, never>;
}
