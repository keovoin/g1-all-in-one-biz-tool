"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeJobPostService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const faker_1 = require("@faker-js/faker");
const html_to_text_1 = require("html-to-text");
const config_1 = require("@gauzy/config");
const plugin_integration_ai_1 = require("@gauzy/plugin-integration-ai");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const employee_job_entity_1 = require("./employee-job.entity");
const jobPost_entity_1 = require("./jobPost.entity");
let EmployeeJobPostService = class EmployeeJobPostService {
    constructor(_employeeService, _gauzyAIService, _integrationTenantService) {
        this._employeeService = _employeeService;
        this._gauzyAIService = _gauzyAIService;
        this._integrationTenantService = _integrationTenantService;
    }
    /**
     * Updates job visibility
     * @param hide Should job be hidden or visible. This will set isActive field to false in Gauzy AI
     * @param employeeId If employeeId set, job will be set not active only for that specific employee (using EmployeeJobPost record update in Gauzy AI)
     * If employeeId is not set, job will be set not active for all employees (using JobPost record update in Gauzy AI)
     * @param providerCode e.g. 'upwork'
     * @param providerJobId Unique job id in the provider, e.g. in Upwork
     */
    async updateVisibility(input) {
        return await this._gauzyAIService.updateVisibility(input);
    }
    /**
     * Create Employee Job Application and updates Employee Job Post record that employee applied for a job
     * @param applied This will set isApplied and appliedDate fields in Gauzy AI
     * @param employeeId Employee who applied for a job
     * @param providerCode e.g. 'upwork', 'linkedin', 'indeed', etc.
     * @param providerJobId Unique job id in the provider, e.g. Job Id in Upwork
     */
    async updateApplied(input) {
        return await this._gauzyAIService.updateApplied(input);
    }
    /**
     * Applies for a job by converting HTML content to plain text and then forwarding the application to a service.
     *
     * @param input The input data for applying to the job, including the job application proposal.
     * @returns A promise that resolves to the result of the job application.
     */
    async apply(input) {
        try {
            const plainText = (0, html_to_text_1.htmlToText)(input.proposal, {
                wordwrap: false // Specify the desired line width for word wrapping
            });
            input.proposal = plainText;
        }
        catch (error) {
            console.log('Error while applying job', error);
            // Handle the error here, you might want to throw it or return a specific error result
        }
        // Return the result of applying for the job
        return await this._gauzyAIService.apply(input);
    }
    /**
     * Find all available Jobs matched to Gauzy Employees
     * @param data
     */
    async findAll(data) {
        const employees = await this._employeeService.findAllActive();
        let jobs;
        try {
            if (config_1.environment.gauzyAIGraphQLEndpoint) {
                const filters = data.filters;
                const { organizationId } = data.filters;
                const tenantId = core_1.RequestContext.currentTenantId() || filters.tenantId;
                // If the user does not have the permission to change selected employee, use the current employee ID
                if (!core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                    // Add the current employee ID to the employeeIds array
                    data.filters.employeeIds = [core_1.RequestContext.currentEmployeeId()];
                }
                // Retrieve integration
                const integration = await this._integrationTenantService.getIntegrationByOptions({
                    organizationId,
                    tenantId,
                    name: contracts_1.IntegrationEnum.GAUZY_AI
                });
                // Check if integration exists
                if (!!integration) {
                    const integrationId = integration['id'];
                    // Check if job matching entity sync is enabled
                    await this._integrationTenantService.findIntegrationTenantByEntity({
                        integrationId,
                        organizationId,
                        entityType: contracts_1.IntegrationEntity.JOB_MATCHING
                    });
                    const result = await this._gauzyAIService.getEmployeesJobPosts(data);
                    if (result === null) {
                        if (config_1.environment.production) {
                            // OK, so for some reason connection go Gauzy AI failed, we can't get jobs ...
                            jobs = {
                                items: [],
                                total: 0
                            };
                        }
                        else {
                            // In development, even if connection failed, we want to show fake jobs in UI
                            jobs = await this.getRandomEmployeeJobPosts(employees, data.limit);
                        }
                    }
                    else {
                        const jobsConverted = result.items.map((job) => {
                            if (job.employeeId) {
                                const employee = employees.find((employee) => employee.id === job.employeeId);
                                job.employee = employee;
                            }
                            return job;
                        });
                        jobs = {
                            items: jobsConverted,
                            total: result.total
                        };
                    }
                }
                else {
                    // If integration not enabled, we want to show fake jobs in UI
                    jobs = await this.getRandomEmployeeJobPosts(employees, data.limit);
                }
            }
            else {
                // If it's production, we should return empty here because we don't want fake jobs in production
                if (config_1.environment.production === false) {
                    jobs = await this.getRandomEmployeeJobPosts(employees, data.limit);
                }
                else {
                    jobs = {
                        items: [],
                        total: 0
                    };
                }
            }
            return jobs;
        }
        catch (error) {
            return {
                items: [],
                total: 0
            };
        }
    }
    /**
     * Call pre process method to create new employee job application record.
     *
     * @param params
     * @returns
     */
    async preProcessEmployeeJobApplication(params) {
        return await this._gauzyAIService.preProcessEmployeeJobApplication(params);
    }
    /**
     * Generate AI proposal for employee job application
     *
     * @param employeeJobApplicationId
     */
    async generateAIProposal(employeeJobApplicationId) {
        return await this._gauzyAIService.generateAIProposalForEmployeeJobApplication(employeeJobApplicationId);
    }
    /**
     * Get employee job application where proposal generated by AI
     *
     * @param employeeJobApplicationId
     * @returns
     */
    async getEmployeeJobApplication(employeeJobApplicationId) {
        return await this._gauzyAIService.getEmployeeJobApplication(employeeJobApplicationId);
    }
    /**
     * Generates random employee job posts.
     *
     * @param employees The array of employees to assign to job posts.
     * @param limit The maximum number of job posts to generate.
     * @returns A promise that resolves to an object containing paginated employee job posts.
     */
    async getRandomEmployeeJobPosts(employees = [], limit = 10) {
        const employeesJobs = [];
        for (let i = 0; i < limit; i++) {
            const employee = faker_1.faker.helpers.arrayElement(employees);
            const jobPostEmployee = new employee_job_entity_1.EmployeeJobPost({
                employeeId: employee ? employee.id : null,
                employee: employee
            });
            const job = new jobPost_entity_1.JobPost({
                country: faker_1.faker.location.countryCode(),
                category: faker_1.faker.person.jobTitle(),
                title: faker_1.faker.lorem.sentence(),
                description: faker_1.faker.lorem.sentences(3),
                jobDateCreated: faker_1.faker.date.past({ years: 0.1 }),
                jobStatus: faker_1.faker.helpers.arrayElement(Object.values(contracts_1.JobPostStatusEnum)),
                jobSource: faker_1.faker.helpers.arrayElement(Object.values(contracts_1.JobPostSourceEnum)),
                jobType: faker_1.faker.helpers.arrayElement(Object.values(contracts_1.JobPostTypeEnum))
            });
            jobPostEmployee.jobPost = job;
            employeesJobs.push(jobPostEmployee);
        }
        return {
            items: employeesJobs,
            total: 100
        };
    }
};
exports.EmployeeJobPostService = EmployeeJobPostService;
exports.EmployeeJobPostService = EmployeeJobPostService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.EmployeeService,
        plugin_integration_ai_1.GauzyAIService,
        core_1.IntegrationTenantService])
], EmployeeJobPostService);
//# sourceMappingURL=employee-job.service.js.map