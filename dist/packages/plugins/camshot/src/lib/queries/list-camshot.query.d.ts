import { IQuery } from "@nestjs/cqrs";
import { BaseQueryDTO } from "@gauzy/core";
import { ICamshot } from "../models/camshot.model";
export declare class ListCamshotQuery implements IQuery {
    readonly params: BaseQueryDTO<ICamshot>;
    static readonly type = "[Camshot] List";
    /**
     * Query to fetch paginated list of camshots
     *
     * @description This query is used to retrieve a paginated list of camshots with optional filtering and sorting
     * @param params - Pagination and filtering parameters for camshots
     */
    constructor(params: BaseQueryDTO<ICamshot>);
}
