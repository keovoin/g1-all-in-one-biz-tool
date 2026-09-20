import { CommandBus } from "@nestjs/cqrs";
import { DeleteResult } from "typeorm";
import { ID, IPagination } from "@gauzy/contracts";
import { BaseQueryDTO, CrudController } from "../core/crud";
import { SharedEntity } from "./shared-entity.entity";
import { SharedEntityService } from "./shared-entity.service";
import { CreateSharedEntityDTO, UpdateSharedEntityDTO } from "./dto";
export declare class SharedEntityController extends CrudController<SharedEntity> {
    private readonly sharedEntityService;
    private readonly commandBus;
    constructor(sharedEntityService: SharedEntityService, commandBus: CommandBus);
    findAll(params: BaseQueryDTO<SharedEntity>): Promise<IPagination<SharedEntity>>;
    getSharedEntityByToken(token: string): Promise<any>;
    create(entity: CreateSharedEntityDTO): Promise<SharedEntity>;
    update(id: ID, entity: UpdateSharedEntityDTO): Promise<SharedEntity>;
    delete(id: ID): Promise<DeleteResult>;
}
