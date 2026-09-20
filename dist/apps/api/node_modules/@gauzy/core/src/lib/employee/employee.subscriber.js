"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const utils_1 = require("@gauzy/utils");
const employee_entity_1 = require("./employee.entity");
const utils_2 = require("../core/utils");
const internal_1 = require("../core/entities/internal");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const entity_event_subscriber_types_1 = require("../core/entities/subscribers/entity-event-subscriber.types");
let EmployeeSubscriber = class EmployeeSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Employee events.
     */
    listenTo() {
        return employee_entity_1.Employee;
    }
    /**
     * Validates the entity manager matches the expected ORM type.
     *
     * @param em The entity manager to validate
     * @param ormType The expected ORM type
     * @returns True if the entity manager matches the expected ORM type
     */
    isValidEntityManager(em, ormType) {
        if (!em)
            return false;
        switch (ormType) {
            case utils_2.MultiORMEnum.TypeORM:
                return em instanceof entity_event_subscriber_types_1.TypeOrmEntityManager;
            case utils_2.MultiORMEnum.MikroORM:
                return em instanceof entity_event_subscriber_types_1.MikroOrmEntityManager;
            default:
                return false;
        }
    }
    /**
     * Counts the total number of employees for an organization.
     *
     * @param em The entity manager
     * @param organizationId The organization ID
     * @param tenantId The tenant ID
     * @param ormType The ORM type
     * @returns The total number of employees
     */
    async countEmployees(em, organizationId, tenantId, ormType) {
        switch (ormType) {
            case utils_2.MultiORMEnum.TypeORM:
                if (em instanceof entity_event_subscriber_types_1.TypeOrmEntityManager) {
                    return em.countBy(employee_entity_1.Employee, { organizationId, tenantId });
                }
                break;
            case utils_2.MultiORMEnum.MikroORM:
                if (em instanceof entity_event_subscriber_types_1.MikroOrmEntityManager) {
                    return em.count(employee_entity_1.Employee, { organizationId, tenantId });
                }
                break;
        }
        console.warn('EmployeeSubscriber: countEmployees - Entity manager type mismatch.');
        return 0;
    }
    /**
     * Updates the organization's total employee count.
     *
     * @param em The entity manager
     * @param organizationId The organization ID
     * @param tenantId The tenant ID
     * @param totalEmployees The total number of employees
     * @param ormType The ORM type
     */
    async updateOrganizationEmployeeCount(em, organizationId, tenantId, totalEmployees, ormType) {
        const criteria = { id: organizationId, tenantId };
        const partialEntity = { totalEmployees };
        switch (ormType) {
            case utils_2.MultiORMEnum.TypeORM:
                if (em instanceof entity_event_subscriber_types_1.TypeOrmEntityManager) {
                    await em.update(internal_1.Organization, criteria, partialEntity);
                }
                break;
            case utils_2.MultiORMEnum.MikroORM:
                if (em instanceof entity_event_subscriber_types_1.MikroOrmEntityManager) {
                    await em.nativeUpdate(internal_1.Organization, criteria, partialEntity);
                }
                break;
        }
    }
    /**
     * Called after an Employee entity is loaded from the database.
     *
     * @param entity - The loaded Employee entity.
     * @param event - The LoadEvent associated with the entity loading.
     */
    async afterEntityLoad(entity) {
        try {
            // Set fullName from the associated user's name, if available
            if (Object.prototype.hasOwnProperty.call(entity, 'user')) {
                await this.setFullName(entity);
            }
            // Set isDeleted to true if the deletedAt property is present and not null
            if (Object.prototype.hasOwnProperty.call(entity, 'deletedAt')) {
                entity.isDeleted = !!entity.deletedAt;
            }
            // Default billRateValue to 0 if it's not set or falsy
            if (Object.prototype.hasOwnProperty.call(entity, 'billRateValue')) {
                entity.billRateValue = entity.billRateValue || 0;
            }
        }
        catch (error) {
            // Handle or log the error as needed
            console.error('EmployeeSubscriber: An error occurred during the afterEntityLoad process:', error.message);
        }
    }
    /**
     * Called before entity is inserted/created to the database.
     *
     * @param entity
     */
    async beforeEntityCreate(entity, em) {
        try {
            // Set fullName from the associated user's name, if available
            if (Object.prototype.hasOwnProperty.call(entity, 'user')) {
                await this.createSlug(entity);
            }
            // Set a default avatar image if none is provided
            if (entity.user) {
                entity.user.imageUrl = entity.user.imageUrl ?? (0, utils_2.getUserDummyImage)(entity.user);
            }
            // Updates the employee's status based on the start and end work dates.
            this.updateEmployeeStatus(entity, em);
        }
        catch (error) {
            console.error('EmployeeSubscriber: An error occurred during the beforeEntityCreate process:', error.message);
        }
    }
    /**
     * Called before the entity is updated in the database.
     *
     * @param entity - The employee entity to be updated.
     */
    async beforeEntityUpdate(entity, em) {
        try {
            // Updates the employee's status based on the start and end work dates.
            this.updateEmployeeStatus(entity, em);
        }
        catch (error) {
            console.error('EmployeeSubscriber: An error occurred during the beforeEntityUpdate process:', error.message);
        }
    }
    /**
     * Called after an entity is inserted/created in the database.
     *
     * @param {Employee} entity - The employee entity that was created.
     * @param {MultiOrmEntityManager} em - The entity manager, either TypeORM's or MikroORM's.
     */
    async afterEntityCreate(entity, em) {
        try {
            if (entity) {
                await this.calculateTotalEmployees(entity, em); // Calculate and update the total number of employees for the organization
            }
        }
        catch (error) {
            console.error('EmployeeSubscriber: An error occurred during the afterEntityCreate process:', error.message);
        }
    }
    /**
     * Called after an entity is removed from the database.
     *
     * @param {Employee} entity - The employee entity that was deleted.
     * @param {MultiOrmEntityManager} em - The entity manager, either TypeORM's or MikroORM's.
     */
    async afterEntityDelete(entity, em) {
        try {
            if (entity) {
                await this.calculateTotalEmployees(entity, em); // Calculate and update the total number of employees for the organization
            }
        }
        catch (error) {
            console.error('EmployeeSubscriber: An error occurred during the afterEntityDelete process:', error);
        }
    }
    /**
     * Builds a full name from first and last name parts.
     *
     * @param firstName The first name (optional)
     * @param lastName The last name (optional)
     * @returns The combined name or null if both are empty
     */
    buildFullName(firstName, lastName) {
        const names = [firstName, lastName]
            .filter((name) => !!name?.trim())
            .map((name) => name.trim());
        return names.length > 0 ? names.join(' ') : null;
    }
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
    getSlugSource(firstName, lastName, username, email) {
        // Priority 1: Use full name if available
        const fullName = this.buildFullName(firstName, lastName);
        if (fullName) {
            return fullName;
        }
        // Priority 2: Use username if available
        if (username?.trim()) {
            return username.trim();
        }
        // Priority 3: Extract name from email
        return (0, utils_1.extractNameFromEmail)(email);
    }
    /**
     * Creates a slug for an Employee entity based on the associated User's information.
     * The slug is generated using the first and last name, username, or email, in that order of preference.
     *
     * @param {Employee} entity - The Employee entity for which to create the slug.
     * @returns {Promise<void>} - Returns a promise indicating the completion of the slug creation process.
     */
    async createSlug(entity) {
        try {
            if (!entity?.user) {
                console.error('EmployeeSubscriber: Entity or User object is not defined.');
                return;
            }
            const { firstName, lastName, username, email } = entity.user;
            // Determine the slug source based on available user information
            const slugSource = this.getSlugSource(firstName, lastName, username, email);
            // Generate and assign the slug
            entity.profile_link = (0, utils_1.sluggable)(slugSource);
        }
        catch (error) {
            console.error(`EmployeeSubscriber: Error creating slug for entity with id ${entity.id}:`, error);
        }
    }
    /**
     * Calculates and updates the total number of employees for an organization.
     * Handles both TypeORM and MikroORM environments.
     *
     * @param {Employee} entity - The employee entity containing organizationId and tenantId.
     * @param {MultiOrmEntityManager} em - The entity manager, either TypeORM's or MikroORM's.
     * @returns {Promise<void>} - Returns a promise indicating the completion of the total employee calculation.
     */
    async calculateTotalEmployees(entity, em) {
        try {
            const { organizationId, tenantId } = entity;
            if (!organizationId)
                return; // Early return if organizationId is missing
            // Get ORM type dynamically at runtime to ensure correct environment selection
            const ormType = (0, utils_2.getORMType)();
            // Validate entity manager matches the ORM type
            if (!this.isValidEntityManager(em, ormType)) {
                console.warn('EmployeeSubscriber: Entity manager is not available or type mismatch.');
                return;
            }
            // Count total employees for the organization
            const totalEmployees = await this.countEmployees(em, organizationId, tenantId, ormType);
            // Update the organization with the calculated total employees
            await this.updateOrganizationEmployeeCount(em, organizationId, tenantId, totalEmployees, ormType);
        }
        catch (error) {
            console.error('EmployeeSubscriber: Error while updating total employee count of the organization:', error);
        }
    }
    /**
     * Updates the employee's status and user's status based on the start and end work dates.
     *
     * @param {Employee} entity - The employee entity to be updated.
     * @param {MultiOrmEntityManager} em - The entity manager used to interact with the database.
     */
    updateEmployeeStatus(entity, em) {
        // Check if the employee has started or ended work
        const hasStartedWork = !!entity.startedWorkOn;
        const hasEndedWork = !!entity.endWork;
        // Update the employee's status based on the work dates
        if (hasStartedWork || hasEndedWork) {
            this.setEmployeeStatus(entity, hasStartedWork, hasEndedWork);
            this.setUserOrganizationStatus(em, entity, hasStartedWork, hasEndedWork);
            if (hasStartedWork) {
                entity.endWork = null; // Clear the end work date if the employee has started work
            }
        }
    }
    /**
     * Sets the employee's status flags and user tracking permissions.
     *
     * @param {Employee} entity - The employee entity.
     * @param {boolean} isActive - True if the employee is active; false otherwise.
     * @param {boolean} isArchived - True if the employee is archived; false otherwise.
     */
    setEmployeeStatus(entity, isActive, isArchived) {
        entity.isTrackingEnabled = isActive;
        entity.allowScreenshotCapture = isActive;
        entity.isActive = isActive;
        entity.isArchived = isArchived;
    }
    /**
     * Sets the full name for the employee entity based on the associated user's name.
     *
     * @param {Employee} entity - The Employee entity whose full name needs to be set.
     * @returns {Promise<void>} - Returns a promise indicating the completion of the operation.
     */
    async setFullName(entity) {
        if (entity?.user?.name) {
            entity.fullName = entity.user.name;
        }
    }
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
    async findEmployee(em, id, organizationId, tenantId, ormType) {
        switch (ormType) {
            case utils_2.MultiORMEnum.TypeORM:
                if (em instanceof entity_event_subscriber_types_1.TypeOrmEntityManager) {
                    return em.findOne(employee_entity_1.Employee, { where: { id, organizationId, tenantId } });
                }
                break;
            case utils_2.MultiORMEnum.MikroORM:
                if (em instanceof entity_event_subscriber_types_1.MikroOrmEntityManager) {
                    return em.findOne(employee_entity_1.Employee, { id, organizationId, tenantId });
                }
                break;
        }
        return null;
    }
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
    async updateUserOrganization(em, userId, organizationId, isActive, isArchived, ormType) {
        // Both keys must select the row: with a missing organizationId the (raw EntityManager) update
        // used to lose that predicate and flip the flags on EVERY organization membership of the user.
        if (!userId || !organizationId) {
            return;
        }
        const criteria = { userId, organizationId };
        const partialEntity = { isActive, isArchived };
        switch (ormType) {
            case utils_2.MultiORMEnum.TypeORM:
                if (em instanceof entity_event_subscriber_types_1.TypeOrmEntityManager) {
                    await em.update(internal_1.UserOrganization, criteria, partialEntity);
                }
                break;
            case utils_2.MultiORMEnum.MikroORM:
                if (em instanceof entity_event_subscriber_types_1.MikroOrmEntityManager) {
                    await em.nativeUpdate(internal_1.UserOrganization, criteria, partialEntity);
                }
                break;
        }
    }
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
    async setUserOrganizationStatus(em, entity, isActive, isArchived) {
        try {
            if (!entity.id) {
                return;
            }
            // Get ORM type dynamically at runtime to ensure correct environment selection
            const ormType = (0, utils_2.getORMType)();
            // Validate entity manager matches the ORM type
            if (!this.isValidEntityManager(em, ormType)) {
                console.warn('EmployeeSubscriber: Entity manager is not available or type mismatch.');
                return;
            }
            // Get the employee details
            const { id, tenantId, organizationId } = entity;
            // Fetch the employee entity to get the userId
            const employee = await this.findEmployee(em, id, organizationId, tenantId, ormType);
            if (!employee) {
                console.warn('EmployeeSubscriber: Employee or associated user not found.');
                return;
            }
            // Update the UserOrganization status
            await this.updateUserOrganization(em, employee.userId, organizationId, isActive, isArchived, ormType);
        }
        catch (error) {
            console.error('EmployeeSubscriber: Error while updating user organization as active/inactive:', error);
        }
    }
};
exports.EmployeeSubscriber = EmployeeSubscriber;
exports.EmployeeSubscriber = EmployeeSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], EmployeeSubscriber);
//# sourceMappingURL=employee.subscriber.js.map