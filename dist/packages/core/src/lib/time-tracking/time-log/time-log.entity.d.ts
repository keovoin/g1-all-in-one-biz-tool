import { ITimeLog, TimeLogType, TimeLogSourceEnum, ITimesheet, IEmployee, ITask, IOrganizationProject, IOrganizationContact, ITimeSlot, IOrganizationTeam, ID } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from './../../core/entities/internal';
export declare class TimeLog extends TenantOrganizationBaseEntity implements ITimeLog {
    startedAt?: Date;
    stoppedAt?: Date;
    /**
     * Edited timestamp column
     */
    editedAt?: Date;
    logType?: TimeLogType;
    source?: TimeLogSourceEnum;
    description?: string;
    reason?: string;
    isBillable?: boolean;
    isRunning?: boolean;
    /**
     * Version of the sources (Desktop/Web/Extension/Mobile) timer
     */
    version?: string;
    /** Additional virtual columns */
    duration: number;
    /**
     * Indicates whether the TimeLog has been edited.
     * If the value is true, it means the TimeLog has been edited.
     * If the value is false or undefined, it means the TimeLog has not been edited.
     */
    isEdited?: boolean;
    /**
     * Employee relationship
     */
    employee: IEmployee;
    employeeId: ID;
    /**
     * Timesheet relationship
     */
    timesheet?: ITimesheet;
    timesheetId?: ID;
    /**
     * Organization Project Relationship
     */
    project?: IOrganizationProject;
    /**
     * Organization Project ID
     */
    projectId?: ID;
    /**
     * Task
     */
    task?: ITask;
    taskId?: ID;
    /**
     * OrganizationContact
     */
    organizationContact?: IOrganizationContact;
    organizationContactId?: ID;
    /**
     * Organization Team
     */
    organizationTeam?: IOrganizationTeam;
    organizationTeamId?: ID;
    /**
     * TimeSlot
     */
    timeSlots?: ITimeSlot[];
    /**
     * Called after entity is loaded.
     */
    afterEntityLoad?(): void;
}
