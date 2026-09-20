/** A workspace-scoped chat identity mapped to an employee in this Gauzy organization. */
export declare class EverAsyncUserMappingDto {
    readonly channel: 'slack' | 'discord';
    readonly workspace: string;
    readonly chatUserId: string;
    readonly employeeId: string;
}
