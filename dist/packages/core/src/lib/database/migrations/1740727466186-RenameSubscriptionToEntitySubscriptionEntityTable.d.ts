import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class RenameSubscriptionToEntitySubscriptionEntityTable1740727466186 implements MigrationInterface {
    name: string;
    /**
     * Up Migration
     *
     * @param queryRunner
     */
    up(queryRunner: QueryRunner): Promise<void>;
    /**
     * Down Migration
     *
     * @param queryRunner
     */
    down(queryRunner: QueryRunner): Promise<void>;
}
