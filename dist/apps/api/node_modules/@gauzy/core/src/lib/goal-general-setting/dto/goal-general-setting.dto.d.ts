import { GoalOwnershipEnum } from "@gauzy/contracts";
export declare abstract class GoalGeneralSettingDTO {
    readonly maxObjectives: number;
    maxKeyResults: number;
    employeeCanCreateObjective: boolean;
    canOwnObjectives: GoalOwnershipEnum;
    canOwnKeyResult: GoalOwnershipEnum;
    krTypeKPI: boolean;
    krTypeTask: boolean;
}
