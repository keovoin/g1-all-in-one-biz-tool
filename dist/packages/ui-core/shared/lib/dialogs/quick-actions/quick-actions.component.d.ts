import { OnInit } from '@angular/core';
import { NbDialogRef, NbIconLibraries, NbMenuItem, NbMenuService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { TimeTrackerService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
type GroupType = {
    groupTitle: string;
    items: any[];
};
export declare class QuickActionsComponent extends TranslationBaseComponent implements OnInit {
    readonly translate: TranslateService;
    private readonly dialogRef;
    private readonly nbMenuService;
    private readonly timeTrackerService;
    private readonly iconLibraries;
    items: NbMenuItem[];
    shortcutDialog: string;
    groupedQuickActions: GroupType[];
    actions: {
        START_TIMER: string;
        STOP_TIMER: string;
    };
    constructor(translate: TranslateService, dialogRef: NbDialogRef<QuickActionsComponent>, nbMenuService: NbMenuService, timeTrackerService: TimeTrackerService, iconLibraries: NbIconLibraries);
    ngOnInit(): void;
    closeDialog(): void;
    private isBelongToGroup;
    private _groupQuickActions;
    static ɵfac: i0.ɵɵFactoryDeclaration<QuickActionsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<QuickActionsComponent, "ngx-quick-actions", never, { "items": { "alias": "items"; "required": false; }; "shortcutDialog": { "alias": "shortcutDialog"; "required": false; }; }, {}, never, never, false, never>;
}
export {};
