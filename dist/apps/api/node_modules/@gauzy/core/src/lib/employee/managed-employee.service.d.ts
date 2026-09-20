import { ID } from '@gauzy/contracts';
import { TypeOrmOrganizationTeamEmployeeRepository } from '../organization-team-employee/repository/type-orm-organization-team-employee.repository';
import { TypeOrmOrganizationProjectEmployeeRepository } from '../organization-project/repository/type-orm-organization-project-employee.repository';
/**
 * Service to handle manager access control and filter accessible employeeIds
 * based on team/project membership and manager status.
 *
 * This service centralizes the logic for determining which employees a user can access,
 * taking into account:
 * - Global permissions (CHANGE_SELECTED_EMPLOYEE)
 * - Team manager status (isManager in OrganizationTeamEmployee)
 * - Project manager status (isManager in OrganizationProjectEmployee)
 */
export declare class ManagedEmployeeService {
    private readonly typeOrmTeamEmployeeRepository;
    private readonly typeOrmProjectEmployeeRepository;
    constructor(typeOrmTeamEmployeeRepository: TypeOrmOrganizationTeamEmployeeRepository, typeOrmProjectEmployeeRepository: TypeOrmOrganizationProjectEmployeeRepository);
    /**
     * Filters the requested employeeIds based on the current user's permissions and manager status.
     *
     * Logic:
     * 1. If user has CHANGE_SELECTED_EMPLOYEE permission → Return requested employeeIds as-is
     * 2. If user explicitly requests "onlyMe" → Return only current user's employeeId
     * 3. If teamIds or projectIds are provided → Check if user is manager and filter accordingly
     * 4. Otherwise → Return only current user's employeeId
     *
     * @param requestedEmployeeIds - The employeeIds requested by the client
     * @param teamIds - The teamIds provided in the request (optional)
     * @param projectIds - The projectIds provided in the request (optional)
     * @param onlyMe - If the user explicitly requests their own data only
     * @returns The filtered list of accessible employeeIds
     */
    filterAccessibleEmployeeIds(requestedEmployeeIds?: ID[], teamIds?: ID[], projectIds?: ID[], onlyMe?: boolean): Promise<ID[]>;
    /**
     * Checks if the current employee is a manager of at least one of the specified teams or projects.
     *
     * @param currentEmployeeId - The employeeId to check
     * @param teamIds - The teamIds to check against
     * @param projectIds - The projectIds to check against
     * @returns True if the employee is a manager of at least one team or project
     */
    isManagerOfTeamsOrProjects(currentEmployeeId: ID, teamIds?: ID[], projectIds?: ID[]): Promise<boolean>;
    /**
     * Checks if the current employee can manage a specific target employee.
     *
     * This method verifies access based on:
     * 1. Global permissions (CHANGE_SELECTED_EMPLOYEE)
     * 2. Self-access (currentEmployeeId === targetEmployeeId)
     * 3. Manager status in the specified team (if organizationTeamId provided)
     * 4. Otherwise, manager status in any team of the record's organization that the target
     *    employee belongs to. This fallback needs `organizationId` and denies without it.
     *
     * @param targetEmployeeId - The employee ID to check access for
     * @param organizationTeamId - Optional team ID to check manager status
     * @param organizationId - The organization the record belongs to; anchors the no-team fallback
     * @returns true if the current employee can manage the target employee
     */
    canManageEmployee(targetEmployeeId: ID, organizationTeamId?: ID, organizationId?: ID): Promise<boolean>;
    /**
     * Checks whether the current employee may view another employee's profile activity.
     *
     * Team-based access requires both employees to be active members of the same active team.
     * Managers may view active teammates; other teammates may view profiles only when the
     * team's profile-sharing setting is explicitly enabled.
     *
     * @param targetEmployeeId - Employee whose profile will be viewed
     * @param organizationId - Organization that owns the profile and team
     * @param organizationTeamId - Optional team used for teammate access
     * @returns true when the current request context is allowed to view the profile
     */
    canViewEmployeeProfile(targetEmployeeId: ID, organizationId: ID, organizationTeamId?: ID): Promise<boolean>;
    /**
     * Checks if the current employee can manage ALL specified employees.
     *
     * This method verifies that the current user can manage every employee in the provided list.
     * It checks against the specified teams (if provided).
     *
     * @param targetEmployeeIds - Array of employee IDs to check access for
     * @param organizationTeamIds - Optional array of team IDs to check manager status
     * @returns true if the current employee can manage ALL target employees
     */
    canManageEmployees(targetEmployeeIds: ID[], organizationTeamIds?: ID[]): Promise<boolean>;
    /**
     * Checks if the current employee can manage a target employee in ANY team.
     *
     * @param targetEmployeeId - The employee ID to check access for
     * @param organizationId - Optional organization to restrict the managed teams to
     * @returns true if the current employee manages the target employee in at least one team
     */
    private canManageEmployeeInAnyTeam;
    /**
     * Gets all employeeIds who are members of the specified teams and/or projects.
     *
     * @param teamIds - The teamIds to get members from
     * @param projectIds - The projectIds to get members from
     * @returns Array of employeeIds who are members of the specified teams/projects
     */
    private getMembersOfTeamsAndProjects;
}
