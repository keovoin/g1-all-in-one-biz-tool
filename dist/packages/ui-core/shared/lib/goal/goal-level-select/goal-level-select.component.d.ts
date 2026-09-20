import { UntypedFormGroup } from '@angular/forms';
import { GoalLevelEnum, IOrganizationTeam, IEmployee } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { OrganizationTeamsService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class GoalLevelSelectComponent {
    private readonly organizationTeamsService;
    private readonly store;
    parentFormGroup: UntypedFormGroup;
    orgId: string;
    teams: IOrganizationTeam[];
    hideOrg: boolean;
    hideEmployee: boolean;
    hideTeam: boolean;
    helperText: string;
    employees: IEmployee[];
    orgName: string;
    enableHelperText: boolean;
    alignedGoal: boolean;
    goalLevelEnum: typeof GoalLevelEnum;
    constructor(organizationTeamsService: OrganizationTeamsService, store: Store);
    getTeams(): Promise<void>;
    selectEmployee(event: any, control: any): void;
    onLevelChange(selectedLevel: GoalLevelEnum): void;
    isLevelHidden(level: GoalLevelEnum): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<GoalLevelSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GoalLevelSelectComponent, "ga-goal-level-select", never, { "parentFormGroup": { "alias": "parentFormGroup"; "required": false; }; "orgId": { "alias": "orgId"; "required": false; }; "teams": { "alias": "teams"; "required": false; }; "hideOrg": { "alias": "hideOrg"; "required": false; }; "hideEmployee": { "alias": "hideEmployee"; "required": false; }; "hideTeam": { "alias": "hideTeam"; "required": false; }; "helperText": { "alias": "helperText"; "required": false; }; "employees": { "alias": "employees"; "required": false; }; "orgName": { "alias": "orgName"; "required": false; }; "enableHelperText": { "alias": "enableHelperText"; "required": false; }; "alignedGoal": { "alias": "alignedGoal"; "required": false; }; }, {}, never, never, false, never>;
}
