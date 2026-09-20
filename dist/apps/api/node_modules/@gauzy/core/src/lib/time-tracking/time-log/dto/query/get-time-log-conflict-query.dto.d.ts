import { TransformFnParams } from 'class-transformer';
import { ID, IGetTimeLogConflictInput } from '@gauzy/contracts';
/**
 * Relations the conflict endpoint is allowed to join and select.
 *
 * `GetConflictTimeLogHandler` turns every name in `relations` into a `leftJoinAndSelect` with no
 * further checking, so the list has to be an allow-list rather than whatever a caller invents.
 *
 * `timeSlots` is deliberately absent: the handler already inner-joins it under that exact alias, and
 * asking for it again makes TypeORM throw on the duplicate alias.
 */
export declare enum TimeLogConflictRelationEnum {
    employee = "employee",
    timesheet = "timesheet",
    project = "project",
    task = "task",
    organizationContact = "organizationContact",
    organizationTeam = "organizationTeam"
}
/**
 * Parses a query value into a UTC `Date`, or `undefined` when it is not a date at all.
 *
 * The handler interpolates these values into the overlap predicate, so an unparseable one must be
 * rejected by validation rather than reaching the query as the string `null`.
 */
export declare function toUtcDate({ value }: TransformFnParams): Date | undefined;
/**
 * Normalises `ignoreId` into an array; the UI sends it as `ignoreId[0]=<uuid>`, other callers as a
 * bare value.
 *
 * An EMPTY result is reported as `undefined`, never as `[]`. `GetConflictTimeLogHandler` guards the
 * exclusion with a plain `if (input.ignoreId)`, and an empty array is truthy: it would reach
 * `NOT IN (:...id)`, which the drivers expand by joining the values — an empty list leaves
 * `NOT IN ()` and the database rejects the statement. `?ignoreId=` used to be a falsy `''` that the
 * handler simply skipped, so anything but `undefined` here would turn a harmless query into a 500.
 */
export declare function toIdArray({ value }: TransformFnParams): ID[] | undefined;
/**
 * Parses `relations` exactly like the shared transform, then drops repeated names.
 *
 * `GetConflictTimeLogHandler` emits one `leftJoinAndSelect(..., relation)` per entry using the
 * relation name as the join alias, so `relations=project,project` would register the alias twice and
 * TypeORM would throw — a 500 on input that passes the allow-list. Order is preserved.
 */
export declare function toUniqueRelations(params: TransformFnParams): string[];
/**
 * Get conflicting time logs request DTO validation.
 *
 * The route used to bind the raw `IGetTimeLogConflictInput` interface with no pipe at all, which
 * meant an arbitrary `employeeId`, `organizationId` and relation list flowed straight into the
 * query. Shape validation here is only half of the fix — `TimeLogService.getConflictTimeLogs`
 * decides whether the caller may read that employee's logs.
 */
export declare class GetTimeLogConflictQueryDTO implements IGetTimeLogConflictInput {
    readonly employeeId: ID;
    readonly organizationId: ID;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly ignoreId?: ID[];
    readonly relations: string[];
}
