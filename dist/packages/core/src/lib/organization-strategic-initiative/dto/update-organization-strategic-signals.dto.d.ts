import { ID, IOrganizationStrategicSignalsUpdateInput, OrganizationStrategicConfidenceLevelEnum, OrganizationStrategicPerceivedMomentumEnum } from '@gauzy/contracts';
/**
 * Update Organization Strategic Signals data validation request DTO
 */
export declare class UpdateOrganizationStrategicSignalsDTO implements IOrganizationStrategicSignalsUpdateInput {
    /**
     * Confidence Level - Subjective confidence in strategic progress
     */
    confidenceLevel?: OrganizationStrategicConfidenceLevelEnum;
    /**
     * Perceived Momentum - Directional energy assessment
     */
    perceivedMomentum?: OrganizationStrategicPerceivedMomentumEnum;
    /**
     * Known Risks - Current blockers or concerns (free-text)
     */
    knownRisks?: string[];
    /**
     * Strategic Notes - Additional context or observations
     */
    strategicNotes?: string;
    /**
     * Last Assessed By ID - Employee who performed the last assessment
     */
    lastAssessedById?: ID;
}
