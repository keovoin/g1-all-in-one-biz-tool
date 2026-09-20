import { ICommandHandler } from "@nestjs/cqrs";
import { CreateCamshotCommand } from "../create-camshot.command";
import { CamshotService } from "../../services/camshot.service";
import { ICamshot } from "../../models/camshot.model";
export declare class CreateCamshotCommandHandler implements ICommandHandler<CreateCamshotCommand> {
    private readonly camshotService;
    constructor(camshotService: CamshotService);
    execute(command: CreateCamshotCommand): Promise<ICamshot>;
}
