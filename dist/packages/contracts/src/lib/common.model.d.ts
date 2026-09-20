/**
 * Interface for entities that can be assigned to a manager.
 */
export interface IManagerAssignable {
    isManager?: boolean;
    assignedAt?: Date;
}
