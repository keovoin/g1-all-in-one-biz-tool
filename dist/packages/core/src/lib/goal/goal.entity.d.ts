import { IGoal, IKeyResult, IOrganizationTeam, IEmployee, ID, IOrganizationStrategicInitiative } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class Goal extends TenantOrganizationBaseEntity implements IGoal {
    name: string;
    description?: string;
    deadline: string;
    level: string;
    progress: number;
    /**
     * OrganizationTeam
     */
    ownerTeam?: IOrganizationTeam;
    ownerTeamId?: ID;
    /**
     * Owner Employee
     */
    ownerEmployee?: IEmployee;
    ownerEmployeeId?: ID;
    /**
     * Lead Employee
     */
    lead?: IEmployee;
    leadId?: ID;
    /**
     * KeyResult
     */
    alignedKeyResult?: IKeyResult;
    alignedKeyResultId?: ID;
    /**
     * Organization Strategic Initiative - Optional alignment to a strategic direction
     * Provides strategic context to this Goal (OKR)
     * Answers: "What strategic direction does this Goal support?"
     */
    organizationStrategicInitiative?: IOrganizationStrategicInitiative;
    /**
     * Organization Strategic Initiative ID
     */
    organizationStrategicInitiativeId?: ID;
    /**
     * KeyResult
     */
    keyResults?: IKeyResult[];
}
