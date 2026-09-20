import { ICommandHandler } from '@nestjs/cqrs';
import { IIntegration } from '@gauzy/contracts';
import { IntegrationGetCommand } from './../integration.get.command';
import { MultiORM } from './../../../core/utils';
import { TypeOrmIntegrationRepository } from '../../repository/type-orm-integration.repository';
import { MikroOrmIntegrationRepository } from '../../repository/mikro-orm-integration.repository';
export declare class IntegrationGetHandler implements ICommandHandler<IntegrationGetCommand> {
    private readonly typeOrmIntegrationRepository;
    private readonly mikroOrmIntegrationRepository;
    protected ormType: MultiORM;
    constructor(typeOrmIntegrationRepository: TypeOrmIntegrationRepository, mikroOrmIntegrationRepository: MikroOrmIntegrationRepository);
    /**
     *
     * @param command
     * @returns
     */
    execute(command: IntegrationGetCommand): Promise<IIntegration[]>;
}
