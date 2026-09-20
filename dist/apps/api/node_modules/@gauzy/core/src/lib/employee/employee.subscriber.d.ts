import { Employee } from './employee.entity';
import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.subscriber';
import { MultiOrmEntityManager } from '../core/entities/subscribers/entity-event-subscriber.types';
export declare class EmployeeSubscriber extends BaseEntityEventSubscriber<Employee> {
    /**
     * Indicates that this subscriber only listen to Employee events.
     */
    listenTo(): typeof Employee;
    /**
     * Validates the entity manager matches the expected ORM type.
     *
     * @param em The entity manager to validate
     * @param ormType The expected ORM type
     * @returns True if the entity manager matches the expected ORM type
     */
    private isValidEntityManager;
    /**
     * Counts the total number of employees for an organization.
     *
     * @param em The entity manager
     * @param organizationId The organization ID
     * @param tenantId The tenant ID
     * @param ormType The ORM type
     * @returns The total number of employees
     */
    private countEmployees;
    /**
     * Updates the organization's total employee count.
     *
     * @param em The entity manager
     * @param organizationId The organization ID
     * @param tenantId The tenant ID
     * @param totalEmployees The total number of employees
     * @param ormType The ORM type
     */
    private updateOrganizationEmployeeCount;
    /**
     * Called after an Employee entity is loaded from the database.
     *
     * @param entity - The loaded Employee entity.
     * @param event - The LoadEvent associated with the entity loading.
     */
    afterEntityLoad(entity: Employee): Promise<void>;
    /**
     * Called before entity is inserted/created to the database.
     *
     * @param entity
     */
    beforeEntityCreate(entity: Employee, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Called before the entity is updated in the database.
     *
     * @param entity - The employee entity to be updated.
     */
    beforeEntityUpdate(entity: Employee, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Called after an entity is inserted/created in the database.
     *
     * @param {Employee} entity - The employee entity that was created.
     * @param {MultiOrmEntityManager} em - The entity manager, either TypeORM's or MikroORM's.
     */
    afterEntityCreate(entity: Employee, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Called after an entity is removed from the database.
     *
     * @param {Employee} entity - The employee entity that was deleted.
     * @param {MultiOrmEntityManager} em - The entity manager, either TypeORM's or MikroORM's.
     */
    afterEntityDelete(entity: Employee, em?: MultiOrmEntityManager): Promise<void>;
    /**
     * Builds a full name from first and last name parts.
     *
     * @param firstName The first name (optional)
     * @param lastName The last name (optional)
     * @returns The combined name or null if both are empty
     */
    private buildFullName;
    /**
     * Determines the slug source based on available user information.
     * Priority: fullName > username > email
     *
     * @param firstName The user's first name
     * @param lastName The user's last name
     * @param username The user's username
     * @param email The user's email
     * @returns The slug source string
     */
    private getSlugSource;
    /**
     * Creates a slug for an Employee entity based on the associated User's information.
     * The slug is generated using the first and last name, username, or email, in that order of preference.
     *
     * @param {Employee} entity - The Employee entity for which to create the slug.
     * @returns {Promise<void>} - Returns a promise indicating the completion of the slug creation process.
     */
    createSlug(entity: Employee): Promise<void>;
    /**
     * Calculates and updates the total number of employees for an organization.
     * Handles both TypeORM and MikroORM environments.
     *
     * @param {Employee} entity - The employee entity containing organizationId and tenantId.
     * @param {MultiOrmEntityManager} em - The entity manager, either TypeORM's or MikroORM's.
     * @returns {Promise<void>} - Returns a promise indicating the completion of the total employee calculation.
     */
    calculateTotalEmployees(entity: Employee, em: MultiOrmEntityManager): Promise<void>;
    /**
     * Updates the employee's status and user's status based on the start and end work dates.
     *
     * @param {Employee} entity - The employee entity to be updated.
     * @param {MultiOrmEntityManager} em - The entity manager used to interact with the database.
     */
    private updateEmployeeStatus;
    /**
     * Sets the employee's status flags and user tracking permissions.
     *
     * @param {Employee} entity - The employee entity.
     * @param {boolean} isActive - True if the employee is active; false otherwise.
     * @param {boolean} isArchived - True if the employee is archived; false otherwise.
     */
    private setEmployeeStatus;
    /**
     * Sets the full name for the employee entity based on the associated user's name.
     *
     * @param {Employee} entity - The Employee entity whose full name needs to be set.
     * @returns {Promise<void>} - Returns a promise indicating the completion of the operation.
     */
    private setFullName;
    /**
     * Fetches an employee by ID using the appropriate ORM method.
     *
     * @param em The entity manager
     * @param id The employee ID
     * @param organizationId The organization ID
     * @param tenantId The tenant ID
     * @param ormType The ORM type
     * @returns The employee entity or null if not found
     */
    private findEmployee;
    /**
     * Updates the user organization status.
     *
     * @param em The entity manager
     * @param userId The user ID
     * @param organizationId The organization ID
     * @param isActive The active status
     * @param isArchived The archived status
     * @param ormType The ORM type
     */
    private updateUserOrganization;
    /**
     * Updates the status (active and archived) of a user organization entity based on the associated employee's details.
     * Handles both TypeORM and MikroORM environments.
     *
     * @param {MultiOrmEntityManager} em - The entity manager, either TypeORM's or MikroORM's, used to interact with the database.
     * @param {Employee} entity - The employee entity containing the user ID, organization ID, and tenant ID information.
     * @param {boolean} isActive - The desired active status to set for the user organization.
     * @param {boolean} isArchived - The desired archived status to set for the user organization.
     * @returns {Promise<void>} - Returns a promise indicating the completion of the user organization status update.
     *
     * @throws {Error} - Logs any error that occurs during the user organization status update process.
     */
    setUserOrganizationStatus(em: MultiOrmEntityManager, entity: Employee, isActive: boolean, isArchived: boolean): Promise<void>;
}
