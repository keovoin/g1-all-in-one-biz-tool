import { IEmployeeRecentVisit, IPagination } from '@gauzy/contracts';
import { EmployeeRecentVisitService } from './employee-recent-visit.service';
import { GetEmployeeRecentVisitsDTO } from './dto/get-employee-recent-visits.dto';
export declare class EmployeeRecentVisitController {
    private readonly _employeeRecentVisitService;
    constructor(_employeeRecentVisitService: EmployeeRecentVisitService);
    /**
     * Retrieves employee recent visits based on query parameters.
     * Supports filtering, pagination, sorting, and ordering.
     *
     * @param query Query parameters for filtering, pagination, and ordering.
     * @returns A list of employee recent visits.
     */
    getEmployeeRecentVisits(query: GetEmployeeRecentVisitsDTO): Promise<IPagination<IEmployeeRecentVisit>>;
}
