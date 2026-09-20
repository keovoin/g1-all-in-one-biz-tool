import { ID, IOrganization, ITimeSlotStatistics, TimeFormatEnum } from '@gauzy/contracts';
export interface RecentActivitiesWindowProps {
    timeSlotEmployees: ITimeSlotStatistics[];
    loading: boolean;
    emptyMessage: string;
    timeZone: string;
    timeFormat: TimeFormatEnum;
    organization: IOrganization | null | undefined;
    dateFormatOptions: {
        dateFormat?: string | null;
        locale?: string | null;
    };
    /** `CHANGE_SELECTED_EMPLOYEE` — shows the avatar and the "View All" button. */
    canChangeSelectedEmployee: boolean;
    /** `redirectToScreenshots(employee)`. */
    onViewAll: (employee: ITimeSlotStatistics) => void;
    /** `/pages/employees/edit/:id` (the avatar link). */
    onOpenEmployee: (id: ID) => void;
    /** `(delete)="onDelete()"` → refresh. */
    onDelete: () => void;
}
/**
 * The Recent Activities window (`gaWindowTemplate` #0): one row per employee with time slots,
 * or the per-period "No screenshot" message.
 */
export declare function RecentActivitiesWindow(props: RecentActivitiesWindowProps): import("react/jsx-runtime").JSX.Element;
