import { QueryRunner } from 'typeorm';
import { IIntegration, IIntegrationType, IntegrationTypeEnum } from '@gauzy/contracts';
export declare class IntegrationsUtils {
    /**
     *
     * @param queryRunner
     */
    static upsertIntegrationsAndIntegrationTypes(queryRunner: QueryRunner, integrations: any[]): Promise<any>;
    /**
     *
     * @param queryRunner
     * @param integrationTypesMap
     * @returns
     */
    static getIntegrationTypeByName(queryRunner: QueryRunner, integrationTypeNames: any[]): Promise<IIntegrationType[]>;
    /**
     *
     * @param queryRunner
     * @param integrationTypeName
     */
    static upsertIntegrationTypes(queryRunner: QueryRunner, integrationTypeNames: IntegrationTypeEnum[]): Promise<void>;
    /**
     *
     *
     * @param queryRunner
     * @param integration
     * @param integrationTypes
     */
    static syncIntegrationType(queryRunner: QueryRunner, integration: IIntegration, integrationTypes: IIntegrationType[]): Promise<void>;
}
