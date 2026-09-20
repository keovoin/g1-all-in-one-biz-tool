import { ICommandHandler } from "@nestjs/cqrs";
import { UpdateResult } from "typeorm";
import { ISharedEntity } from "@gauzy/contracts";
import { SharedEntityUpdateCommand } from "../shared-entity.update.command";
import { SharedEntityService } from "../../shared-entity.service";
export declare class SharedEntityUpdateHandler implements ICommandHandler<SharedEntityUpdateCommand> {
    private readonly sharedEntityService;
    constructor(sharedEntityService: SharedEntityService);
    execute(command: SharedEntityUpdateCommand): Promise<ISharedEntity | UpdateResult>;
}
