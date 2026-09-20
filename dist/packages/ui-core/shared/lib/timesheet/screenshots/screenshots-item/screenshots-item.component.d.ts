import { OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ITimeSlot, IScreenshot, IOrganization, IEmployee, TimeFormatEnum, ID } from '@gauzy/contracts';
import { progressStatus } from '@gauzy/ui-core/common';
import { ErrorHandlingService, Store, TimesheetService, ToastrService } from '@gauzy/ui-core/core';
import { GalleryItem } from '../../../gallery/gallery.directive';
import { GalleryService } from '../../../gallery/gallery.service';
import { TimeZoneService } from '../../gauzy-filters/timezone-filter';
import * as i0 from "@angular/core";
export declare class ScreenshotsItemComponent implements OnInit, OnDestroy {
    private readonly _nbDialogService;
    private readonly _timesheetService;
    private readonly _galleryService;
    private readonly _toastrService;
    private readonly _errorHandlingService;
    private readonly _store;
    private readonly _timeZoneService;
    isShowBorder: boolean;
    organization: IOrganization;
    progressStatus: typeof progressStatus;
    fallbackSvg: string;
    _employees: IEmployee[];
    get employees(): IEmployee[];
    set employees(employees: IEmployee[]);
    multiple: boolean;
    selectionMode: boolean;
    galleryItems: GalleryItem[];
    isSelected: boolean;
    employeeId: IEmployee['id'];
    slotIds: ID[];
    delete: EventEmitter<ID[]>;
    toggle: EventEmitter<ID>;
    private _timeSlot;
    get timeSlot(): ITimeSlot;
    set timeSlot(timeSlot: ITimeSlot);
    private _screenshots;
    get screenshots(): IScreenshot[];
    set screenshots(screenshots: IScreenshot[]);
    private _lastScreenshot;
    get lastScreenshot(): IScreenshot;
    set lastScreenshot(screenshot: IScreenshot);
    timezone: string;
    timeFormat: TimeFormatEnum;
    constructor(_nbDialogService: NbDialogService, _timesheetService: TimesheetService, _galleryService: GalleryService, _toastrService: ToastrService, _errorHandlingService: ErrorHandlingService, _store: Store, _timeZoneService: TimeZoneService);
    ngOnInit(): void;
    /**
     * Toggles the selection of a time slot.
     * If the time slot allows deletion, it emits the time slot's ID.
     *
     * @param {ITimeSlot} timeSlot - The time slot to toggle.
     */
    toggleSelect(timeSlot: ITimeSlot): void;
    /**
     * Deletes a time slot if deletion is allowed and handles related tasks.
     *
     * @param timeSlot The time slot to be deleted.
     */
    deleteSlot(timeSlot: ITimeSlot): Promise<void>;
    /**
     * Opens a modal to view information about the provided time slot.
     *
     * @param timeSlot - The time slot for which information is to be viewed.
     */
    viewInfo(timeSlot: ITimeSlot): void;
    /**
     * Checks if the provided time slot can be deleted based on certain conditions.
     *
     * @param timeSlot - The time slot to be checked for deletion.
     * @returns True if deletion is allowed, false otherwise.
     */
    isEnableDelete(timeSlot: ITimeSlot): boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScreenshotsItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ScreenshotsItemComponent, "ngx-screenshots-item", never, { "employees": { "alias": "employees"; "required": false; }; "multiple": { "alias": "multiple"; "required": false; }; "selectionMode": { "alias": "selectionMode"; "required": false; }; "galleryItems": { "alias": "galleryItems"; "required": false; }; "isSelected": { "alias": "isSelected"; "required": false; }; "employeeId": { "alias": "employeeId"; "required": false; }; "slotIds": { "alias": "slotIds"; "required": false; }; "timeSlot": { "alias": "timeSlot"; "required": false; }; "timezone": { "alias": "timezone"; "required": false; }; "timeFormat": { "alias": "timeFormat"; "required": false; }; }, { "delete": "delete"; "toggle": "toggle"; }, never, never, false, never>;
}
