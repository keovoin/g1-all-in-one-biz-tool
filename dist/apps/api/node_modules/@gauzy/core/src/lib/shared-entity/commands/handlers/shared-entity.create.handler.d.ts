import { ICommandHandler } from "@nestjs/cqrs";
import { ISharedEntity } from "@gauzy/contracts";
import { SharedEntityCreateCommand } from "../shared-entity.create.command";
import { SharedEntityService } from "../../shared-entity.service";
export declare class SharedEntityCreateHandler implements ICommandHandler<SharedEntityCreateCommand> {
    private readonly sharedEntityService;
    constructor(sharedEntityService: SharedEntityService);
    execute(command: SharedEntityCreateCommand): Promise<ISharedEntity>;
}
