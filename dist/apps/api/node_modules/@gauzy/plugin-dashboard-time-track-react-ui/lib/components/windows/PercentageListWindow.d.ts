import '../nebular-jsx';
import { type ReactNode } from 'react';
/** One row of the Tasks / Projects windows. */
export interface PercentageListRow {
    id: string;
    name: ReactNode;
    durationPercentage: number | undefined;
    duration: number | undefined;
}
export interface PercentageListWindowProps {
    title: string;
    rows: PercentageListRow[];
    loading: boolean;
    emptyMessage: string;
    /** Optional "View All" button (the Tasks window has one, Projects does not). */
    action?: {
        label: string;
        onClick: () => void;
    };
}
/**
 * The Tasks (`gaWindowTemplate` #2) and Projects (#3) windows: name, `x%` + tiny progress bar,
 * duration — the same `nb-list` row both Angular templates render.
 */
export declare function PercentageListWindow({ title, rows, loading, emptyMessage, action }: PercentageListWindowProps): import("react/jsx-runtime").JSX.Element;
