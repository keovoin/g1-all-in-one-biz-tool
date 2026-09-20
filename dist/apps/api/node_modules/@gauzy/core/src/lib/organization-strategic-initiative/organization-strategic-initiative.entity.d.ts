import { EntityRepositoryType } from '@mikro-orm/core';
import { ID, IEmployee, IGoal, IOrganizationProject, IOrganizationStrategicInitiative, IOrganizationStrategicSignals, OrganizationStrategicStateEnum, OrganizationStrategicVisibilityScopeEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
import { MikroOrmOrganizationStrategicInitiativeRepository } from './repository/mikro-orm-organization-strategic-initiative.repository';
export declare class OrganizationStrategicInitiative extends TenantOrganizationBaseEntity implements IOrganizationStrategicInitiative {
    [EntityRepositoryType]?: MikroOrmOrganizationStrategicInitiativeRepository;
    /**
     * Title - Short, human-readable name for the initiative
     */
    title: string;
    /**
     * Intent - Long-form description of the strategic intent
     * Answers: "What are we deliberately trying to move forward — and why?"
     */
    intent?: string;
    /**
     * Strategic State - Current lifecycle phase
     * - draft: Strategic intent is being articulated
     * - active: Leadership validated, projects are being aligned
     * - resolved: Strategy fulfilled its purpose
     * - retired: Strategy discontinued or transformed
     */
    state: OrganizationStrategicStateEnum;
    /**
     * Visibility Scope - Who can see this initiative
     * - leadership: Only organization admins/managers
     * - organization: All organization members
     * - team: Members of teams linked to associated projects
     */
    visibilityScope: OrganizationStrategicVisibilityScopeEnum;
    /**
     * Strategic Signals - Qualitative signals stored as structured metadata
     * These are human-authored and NOT derived automatically from project data
     * Includes: confidenceLevel, perceivedMomentum, knownRisks, strategicNotes
     */
    signals?: IOrganizationStrategicSignals | string;
    /**
     * Steward - Owns the clarity of the strategy's intent
     * Responsible for directional integrity, not delivery
     * They do NOT manage daily execution
     */
    steward?: IEmployee;
    /**
     * Steward ID
     */
    stewardId?: ID;
    /**
     * Goals aligned with this initiative (ManyToOne from Goal side)
     * A Goal can be optionally aligned to ONE strategic initiative
     * Provides strategic context to OKR measurements
     */
    goals?: IGoal[];
    /**
     * Projects aligned with this initiative (ManyToMany)
     * A Project can contribute to multiple strategic directions simultaneously
     * Note: This is the inverse side of the relationship
     */
    projects?: IOrganizationProject[];
}
