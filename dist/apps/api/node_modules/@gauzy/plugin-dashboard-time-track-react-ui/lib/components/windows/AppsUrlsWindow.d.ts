import '../nebular-jsx';
import { IActivitiesStatistics } from '@gauzy/contracts';
/**
 * `ngx-activity-item [isDashboard]="true"` for one activity: title (5 cols), `x%` + tiny bar,
 * duration. The percentage is truncated to an integer like the Angular `item` setter
 * (`parseInt(...).toFixed(1)`).
 */
export declare function ActivityItem({ item }: {
    item: IActivitiesStatistics;
}): import("react/jsx-runtime").JSX.Element;
export interface AppsUrlsWindowProps {
    activities: IActivitiesStatistics[];
    loading: boolean;
    emptyMessage: string;
    /** `redirectToAppUrlReport()`. */
    onViewReport: () => void;
}
/**
 * The Apps & URLs window (`gaWindowTemplate` #4): "View Report" + one activity item per row.
 */
export declare function AppsUrlsWindow({ activities, loading, emptyMessage, onViewReport }: AppsUrlsWindowProps): import("react/jsx-runtime").JSX.Element;
