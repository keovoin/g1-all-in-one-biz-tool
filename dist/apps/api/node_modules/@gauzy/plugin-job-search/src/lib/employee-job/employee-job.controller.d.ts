import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { ID, IEmployee, IEmployeeJobApplication, IEmployeeJobApplicationAppliedResult, IEmployeeJobPost, IGetEmployeeJobPostInput, IPagination, IUpdateEmployeeJobPostAppliedResult, IVisibilityJobPostInput } from '@gauzy/contracts';
import { BaseQueryDTO, Employee } from '@gauzy/core';
import { EmployeeJobPostService } from './employee-job.service';
import { EmployeeJobStatisticDTO } from './dto';
export declare class EmployeeJobPostController {
    private readonly _employeeJobPostService;
    private readonly _commandBus;
    private readonly _queryBus;
    constructor(_employeeJobPostService: EmployeeJobPostService, _commandBus: CommandBus, _queryBus: QueryBus);
    /**
     * Find all employee job posts.
     *
     * @param input - Query parameters for filtering employee job posts.
     * @returns A paginated list of employee job posts.
     */
    findAll(input: IGetEmployeeJobPostInput): Promise<IPagination<IEmployeeJobPost>>;
    /**
     * GET employee job statistics.
     *
     * This endpoint retrieves statistics related to employee jobs,
     * providing details about job distribution, assignments, or other related data.
     *
     * @param options Pagination parameters for retrieving the data.
     * @returns A paginated list of employee job statistics.
     */
    getEmployeeJobsStatistics(query: BaseQueryDTO<Employee>): Promise<IPagination<IEmployee>>;
    /**
     * UPDATE employee's job search status by their IDs
     *
     * This endpoint allows updating the job search status of an employee, given their ID.
     *
     * @param employeeId The unique identifier of the employee whose job search status is being updated.
     * @param entity The updated job search status information.
     * @returns A promise resolving to the updated employee record or an update result.
     */
    updateJobSearchStatus(employeeId: ID, input: EmployeeJobStatisticDTO): Promise<IEmployee | UpdateResult>;
    /**
     * Apply for a job.
     *
     * @param input - The input for the job application.
     * @returns A promise that resolves to the applied job post details.
     */
    apply(input: IEmployeeJobApplication): Promise<IEmployeeJobApplicationAppliedResult | null>;
    /**
     * Update the status of a job application.
     *
     * @param input - The input for updating the job application.
     * @returns A promise that resolves to the updated job post details.
     */
    updateApplied(input: IEmployeeJobApplication): Promise<IUpdateEmployeeJobPostAppliedResult | null>;
    /**
     * Update the visibility status for a job.
     *
     * @param data - The input for updating the job visibility.
     * @returns A promise that resolves to the updated job post details.
     */
    updateVisibility(data: IVisibilityJobPostInput): Promise<boolean | null>;
    /**
     * Create a preliminary record for an employee job application.
     *
     * @param input - The input for creating the preliminary job application record.
     * @returns A promise that resolves to the partial details of the created job application.
     */
    preProcessEmployeeJobApplication(input: IEmployeeJobApplication): Promise<Partial<IEmployeeJobApplication> | null>;
    /**
     * Get AI-generated proposal for an employee job application.
     *
     * @param employeeJobApplicationId - The ID of the employee job application.
     * @returns A promise that resolves to the AI-generated proposal details.
     */
    getEmployeeJobApplication(employeeJobApplicationId: ID): Promise<void | null>;
    /**
     * Generate AI proposal for an employee job application.
     *
     * @param employeeJobApplicationId - The ID of the employee job application.
     * @returns A promise that resolves to the generated AI proposal details.
     */
    generateAIProposal(employeeJobApplicationId: string): Promise<void | null>;
}
