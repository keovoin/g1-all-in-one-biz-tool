import '../nebular-jsx';
import { ID, IMembersStatistics } from '@gauzy/contracts';
import { RangePeriod } from '../../utils/period.utils';
export interface MembersWindowProps {
    members: IMembersStatistics[];
    loading: boolean;
    emptyMessage: string;
    selectedPeriod: RangePeriod | undefined;
    /** `isMoreThanWeek()` — hides the 7-bar graph and stacks the week cell. */
    moreThanWeek: boolean;
    /** `/pages/employees/edit/:id`. */
    onOpenEmployee: (id: ID) => void;
}
/**
 * The Members window (`gaWindowTemplate` #5): Member info / Today / This week|Over period table
 * with duration + activity badge per cell and the 7-bar weekly graph.
 */
export declare function MembersWindow({ members, loading, emptyMessage, selectedPeriod, moreThanWeek, onOpenEmployee }: MembersWindowProps): import("react/jsx-runtime").JSX.Element;
