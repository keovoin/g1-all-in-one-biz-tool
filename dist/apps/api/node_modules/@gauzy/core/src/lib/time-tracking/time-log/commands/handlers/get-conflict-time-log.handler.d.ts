import { ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@gauzy/config';
import { TimeLog } from './../../time-log.entity';
import { IGetConflictTimeLogCommand } from '../get-conflict-time-log.command';
import { TypeOrmTimeLogRepository } from '../../repository/type-orm-time-log.repository';
import { MikroOrmTimeLogRepository } from '../../repository/mikro-orm-time-log.repository';
import { MultiORM } from './../../../../core/utils';
export declare class GetConflictTimeLogHandler implements ICommandHandler<IGetConflictTimeLogCommand> {
    private readonly typeOrmTimeLogRepository;
    private readonly mikroOrmTimeLogRepository;
    private readonly configService;
    protected ormType: MultiORM;
    constructor(typeOrmTimeLogRepository: TypeOrmTimeLogRepository, mikroOrmTimeLogRepository: MikroOrmTimeLogRepository, configService: ConfigService);
    execute(command: IGetConflictTimeLogCommand): Promise<TimeLog[]>;
}
