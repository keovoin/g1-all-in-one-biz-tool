import * as i0 from "@angular/core";
export declare class DashboardSkeletonComponent {
    type: 'widget' | 'window' | 'card';
    windowType?: 'recent-activities' | 'manual-time' | 'tasks' | 'projects' | 'apps-urls' | 'members';
    trackByIndex(index: number): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<DashboardSkeletonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DashboardSkeletonComponent, "ga-dashboard-skeleton", never, { "type": { "alias": "type"; "required": false; }; "windowType": { "alias": "windowType"; "required": false; }; }, {}, never, never, false, never>;
}
