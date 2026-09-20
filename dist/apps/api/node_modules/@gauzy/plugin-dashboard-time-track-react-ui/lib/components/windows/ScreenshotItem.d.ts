import { ID, IOrganization, IScreenshot, ITimeSlot, TimeFormatEnum } from '@gauzy/contracts';
export interface ScreenshotItemProps {
    timeSlot: ITimeSlot;
    /** IANA zone the times are rendered in (`[timezone]`). */
    timeZone: string;
    /** 12/24 (`[timeFormat]`). */
    timeFormat: TimeFormatEnum;
    /** Owner of the slot; the gallery filters its strip by it (`[employeeId]`). */
    employeeId?: ID;
    /** The organization the slot belongs to (for the delete request + toast). */
    organization: IOrganization | null | undefined;
    /** Organization date format / locale for the caption date. */
    dateFormatOptions: {
        dateFormat?: string | null;
        locale?: string | null;
    };
    /** Fired after a slot was deleted (from the trash button or the info modal). */
    onDelete: (ids: ID[]) => void;
}
/**
 * Prepares a slot exactly like the `ScreenshotsItemComponent.timeSlot` setter: screenshots
 * stamped with the slot's `employeeId`, the danger border when every screenshot is flagged not
 * work-related, `isAllowDelete` when no log is running, and the newest screenshot as thumbnail.
 *
 * @param timeSlot Raw slot from the statistics endpoint.
 */
export declare function prepareTimeSlot(timeSlot: ITimeSlot): {
    slot: ITimeSlot;
    screenshots: IScreenshot[];
    lastScreenshot: IScreenshot | null;
    isShowBorder: boolean;
};
/**
 * React port of `<ngx-screenshots-item [multiple]="false">`: thumbnail with the hover actions
 * (delete with confirm, description info, View Screen → the shared Angular gallery dialog, View
 * Info → the Angular screenshots modal) and the slot info block (time range in the selected
 * zone/format, date caption, activity bar, "x% of mm Minutes").
 *
 * The dialogs and services are the Angular ones, obtained through the injector, so the gallery,
 * the delete request, the toast and the error handling are byte-identical to the Angular tab.
 */
export declare function ScreenshotItem({ timeSlot, timeZone, timeFormat, employeeId, organization, dateFormatOptions, onDelete }: ScreenshotItemProps): import("react/jsx-runtime").JSX.Element;
