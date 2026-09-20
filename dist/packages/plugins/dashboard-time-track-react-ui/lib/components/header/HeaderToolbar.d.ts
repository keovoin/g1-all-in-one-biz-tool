export interface HeaderToolbarProps {
    autoRefresh: boolean;
    onAutoRefreshChange: (value: boolean) => void;
    /** `logs$.next(true)`. */
    onRefresh: () => void;
}
/**
 * The second header row of the Angular tab: the "Auto Refresh" `nb-toggle` (small, basic) and
 * the outline "Refresh" button, which is disabled while auto-refresh is on.
 */
export declare function HeaderToolbar({ autoRefresh, onAutoRefreshChange, onRefresh }: HeaderToolbarProps): import("react/jsx-runtime").JSX.Element;
