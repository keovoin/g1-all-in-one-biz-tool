import '../nebular-jsx';
import { ID, IManualTimesStatistics } from '@gauzy/contracts';
export interface ManualTimeWindowProps {
    manualTimes: IManualTimesStatistics[];
    loading: boolean;
    emptyMessage: string;
    dateFormatOptions: {
        dateFormat?: string | null;
        locale?: string | null;
    };
    /** `redirectToManualTimeReport()`. */
    onViewReport: () => void;
    /** `/pages/employees/edit/:id`. */
    onOpenEmployee: (id: ID) => void;
}
/**
 * The Manual Time window (`gaWindowTemplate` #1): "View Report" + a Member / Project /
 * Duration / Date table.
 */
export declare function ManualTimeWindow({ manualTimes, loading, emptyMessage, dateFormatOptions, onViewReport, onOpenEmployee }: ManualTimeWindowProps): import("react/jsx-runtime").JSX.Element;
