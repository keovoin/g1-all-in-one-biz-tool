import { IQueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { GetPluginTenantUsersQuery } from '../get-plugin-tenant-users.query';
export interface PluginTenantUser {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    imageUrl?: string;
    accessType: 'allowed' | 'denied';
    assignedAt?: Date;
}
export interface GetPluginTenantUsersResult {
    items: PluginTenantUser[];
    total: number;
}
export declare class GetPluginTenantUsersHandler implements IQueryHandler<GetPluginTenantUsersQuery> {
    private readonly dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    execute(query: GetPluginTenantUsersQuery): Promise<GetPluginTenantUsersResult>;
}
