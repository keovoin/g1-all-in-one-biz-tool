import { OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { progressStatus } from '@gauzy/ui-core/common';
import { IDailyActivity } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ActivityItemComponent implements OnInit, OnDestroy {
    childOpen: boolean;
    progressStatus: typeof progressStatus;
    loadChild: EventEmitter<any>;
    allowChild: boolean;
    isDashboard: boolean;
    private _item;
    get item(): IDailyActivity;
    set item(value: IDailyActivity);
    private _visitedDate;
    get visitedDate(): string;
    set visitedDate(value: string);
    ngOnInit(): void;
    /**
     * Toggles the child component's visibility.
     * If the child is opened, emits the loadChild event with the current item.
     */
    toggleChild(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ActivityItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ActivityItemComponent, "ngx-activity-item", never, { "allowChild": { "alias": "allowChild"; "required": false; }; "isDashboard": { "alias": "isDashboard"; "required": false; }; "item": { "alias": "item"; "required": false; }; "visitedDate": { "alias": "visitedDate"; "required": false; }; }, { "loadChild": "loadChild"; }, never, never, false, never>;
}
