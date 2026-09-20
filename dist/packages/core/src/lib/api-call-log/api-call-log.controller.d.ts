import { DeleteResult } from 'typeorm';
import { IApiCallLog, ID, IPagination } from '@gauzy/contracts';
import { ApiCallLogService } from './api-call-log.service';
import { ApiCallLogFilterDTO } from './dto/api-call-log-filter.dto';
import { DeleteApiCallLogDTO } from './dto/api-call-log-delete.dto';
import { ApiCallLog } from './api-call-log.entity';
export declare class ApiCallLogController {
    private readonly _apiCallLogService;
    constructor(_apiCallLogService: ApiCallLogService);
    /**
     * Retrieves a paginated and filtered list of all API call logs from the system.
     *
     * @param filters DTO containing filtering options like `organizationId`, `correlationId`, `url`, etc.
     * @returns A promise that resolves to a paginated list of `IApiCallLog` objects.
     */
    findAll(filters: ApiCallLogFilterDTO): Promise<IPagination<IApiCallLog>>;
    /**
     * Deletes an API call log by its ID.
     *
     * @param id The ID of the API call log to be deleted.
     * @returns A promise that resolves to an object indicating the delete status.
     */
    deleteById(id: ID, filters: DeleteApiCallLogDTO): Promise<DeleteResult | ApiCallLog>;
}
