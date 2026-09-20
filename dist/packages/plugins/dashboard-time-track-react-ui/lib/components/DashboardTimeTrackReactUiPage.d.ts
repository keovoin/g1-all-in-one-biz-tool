import './nebular-jsx';
/**
 * Props the Angular host passes once (`[props]`): the header slots the controls portal into.
 * A type alias (not an interface) so it is assignable to the directive's `Record<string, unknown>`.
 */
export type DashboardTimeTrackReactUiPageProps = {
    /** Right side of the title row: timezone filter + "Manage widgets". */
    headerActionsHost?: HTMLElement | null;
    /** Second header row: "Auto Refresh" toggle + "Refresh". */
    headerToolbarHost?: HTMLElement | null;
};
/**
 * DashboardTimeTrackReactUiPage — the React Time Tracking dashboard, feature-for-feature with
 * the Angular `TimeTrackingComponent`.
 *
 * Mounted once in the page card body by `DashboardTimeTrackReactUiPageComponent`; the header
 * controls are rendered into the card header through portals. Everything below the header —
 * the six counter widgets, the six windows, the ⋮ menus, drag & drop, the Manage-widgets popover
 * — is React; data, layout persistence, permissions, dialogs and navigation go through the
 * Angular services obtained from the injector, so both flavours share one data path and one
 * persisted layout.
 */
export declare function DashboardTimeTrackReactUiPage({ headerActionsHost, headerToolbarHost }: DashboardTimeTrackReactUiPageProps): import("react/jsx-runtime").JSX.Element;
