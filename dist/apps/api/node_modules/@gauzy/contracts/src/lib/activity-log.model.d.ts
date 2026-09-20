import { ActorTypeEnum, IBasePerEntityType, JsonData, OmitFields } from './base-entity.model';
import { IEmployeeEntityInput } from './employee.model';
/**
 * Interface representing an activity log entry.
 */
export interface IActivityLog extends IEmployeeEntityInput, IBasePerEntityType {
    action: ActionTypeEnum;
    actorType?: ActorTypeEnum;
    description?: string;
    updatedFields?: string[];
    previousValues?: IActivityLogUpdatedValues[];
    updatedValues?: IActivityLogUpdatedValues[];
    previousEntities?: IActivityLogUpdatedValues[];
    updatedEntities?: IActivityLogUpdatedValues[];
    data?: JsonData;
}
export interface IActivityLogUpdatedValues {
    [x: string]: Record<string, any>;
}
/**
 * Enum for action types in the activity log.
 */
export declare enum ActionTypeEnum {
    Created = "Created",
    Updated = "Updated",
    Deleted = "Deleted"
}
/**
 * Input type for activity log creation, excluding `employeeId` and `employee`.
 */
export interface IActivityLogInput extends OmitFields<IActivityLog> {
}
