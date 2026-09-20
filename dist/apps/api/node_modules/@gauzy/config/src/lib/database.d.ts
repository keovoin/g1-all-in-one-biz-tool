import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { KnexModuleOptions } from 'nest-knexjs';
/**
 * Type representing the ORM types.
 */
export type MultiORM = 'typeorm' | 'mikro-orm';
/**
 * TypeORM DB connection configuration.
 */
export declare const dbTypeOrmConnectionConfig: ({
    name?: string;
    retryAttempts?: number;
    retryDelay?: number;
    toRetry?: (err: any) => boolean;
    autoLoadEntities?: boolean;
    verboseRetryLog?: boolean;
    manualInitialization?: boolean;
} & Partial<import("typeorm/driver/better-sqlite3/BetterSqlite3DataSourceOptions").BetterSqlite3DataSourceOptions>) | ({
    name?: string;
    retryAttempts?: number;
    retryDelay?: number;
    toRetry?: (err: any) => boolean;
    autoLoadEntities?: boolean;
    verboseRetryLog?: boolean;
    manualInitialization?: boolean;
} & Partial<import("typeorm/driver/mysql/MysqlDataSourceOptions").MysqlDataSourceOptions>) | ({
    name?: string;
    retryAttempts?: number;
    retryDelay?: number;
    toRetry?: (err: any) => boolean;
    autoLoadEntities?: boolean;
    verboseRetryLog?: boolean;
    manualInitialization?: boolean;
} & Partial<import("typeorm/driver/postgres/PostgresDataSourceOptions").PostgresDataSourceOptions>);
/**
 * MikroORM DB connection configuration.
 */
export declare const dbMikroOrmConnectionConfig: MikroOrmModuleOptions;
/**
 * Knex DB connection configuration.
 */
export declare const dbKnexConnectionConfig: KnexModuleOptions;
